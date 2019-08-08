const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('./schemas').schemas;
const config = require('../config');
const dbDataSchema = config.vars.database.SCHEMA_DATA;
const dbViewSchema = config.vars.database.SCHEMA_VIEW;

// Default query settings
const queryDefaults = {
    limit: 10,
    limitMax: 20,
    offset: 0,
    reverse: false
};

class Model {
    /**
     * 
     * @param {string} tableName - Name for the database table to use when writing (create, update etc.).
     * @param {string} viewName - Name for the view to use when reading.
     * @param {*} schema - An object where each key is a Joi schema object.
     */
    constructor(tableName, viewName, schema) {
        this.tableName = tableName;
        this.viewName = viewName;
        this.writeTable = `${dbDataSchema}.${tableName}`;
        this.readTable = `${dbViewSchema}.${viewName}`;
        this.schema = {
            input: schema.input,
            output: schema.output
        };
    }

    /**
     * Returns the Joi schema for the limit query.
     * @param {number} max - Maximum amount of rows a query can return.
     * @param {number} defaultValue 
     */
    getLimitSchema(max = queryDefaults.limitMax, defaultValue = queryDefaults.limit) {
        const description = `Maximum amount of rows to return. Maximum value for this endpoint is **${max}**.`;
        return Joi.number().integer().min(1).max(max).default(defaultValue).description(description);
    }

    /**
     * Returns the Joi schema for the offset query.
     * @param {number} defaultValue 
     */
    getOffsetSchema(defaultValue = queryDefaults.offset) {
        const description = 'Number of rows to skip before returning the results.';
        return Joi.number().integer().min(0).default(defaultValue).description(description);
    }

    /**
     * Returns the Joi schema for the sort query. The valid columns are determined by
     * the output schema passed in at construction.
     */
    getSortSchema() {
        const description = 'Column to sort the results by.';
        const validColumns = Object.keys(this.schema.output);
        return Joi.string().valid(validColumns).default(validColumns[0]).description(description);
    }

    /**
     * Returns the Joi schema for the reverse query.
     * @param {number} defaultValue 
     */
    getReverseSchema(defaultValue = queryDefaults.reverse) {
        const description = 'Whether to reverse the sort order.';
        return Joi.boolean().default(defaultValue).description(description);
    }

    /**
     * Returns the Joi schema for where query. Each where query can specify one
     * column (valid columns determined by the output schema), an operator and 
     * a value.
     * @example where=elo>1400
     */
    getWhereSchema() {
        const schema = this.schema.output;
        const columns = Object.keys(schema);
        const operators = ['ILIKE', 'LIKE', '>=', '<=', '<>', '!=', '=', '>', '<'];
        const logicalOperators = ['AND', 'NOT', 'OR'];
        const regex = `^(${columns.join('|')}) *(${operators.join('|')}) *(.+?) *(${logicalOperators.join('|')})?$`;

        // Extend Joi to add a custom validator
        const customJoi = Joi.extend((joi) => ({
            base: joi.array(),
            name: 'array',
            language: {
                whereQueryCoerce: 'one or more conditions are improperly formatted',
                whereQueryValidate: 'one or more conditions have invalid values',
                whereQueryLike: 'one or more conditions use the LIKE operator but are not strings'
            },

            coerce: function (value, state, options) {
                const conditions = [];

                // Always make the where parameter an array
                if (value) {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                } else {
                    value = [];
                }

                // Split each condition into an object with the following keys: column, operator, value and logicalOperator
                for (let i = 0; i < value.length; i++) {
                    const matchResult = value[i].match(regex);
                    if (!matchResult) {
                        return this.createError('array.whereQueryCoerce', {}, state, options);
                    }

                    // Default the logical operator to AND if not specified
                    if (!matchResult[4]) matchResult[4] = logicalOperators[0];

                    // Don't add logical operator for the last condition
                    const logicalOperator = (i < value.length - 1) ? matchResult[4] : '';

                    conditions.push({
                        column: matchResult[1],
                        operator: matchResult[2],
                        value: matchResult[3],
                        logicalOperator: logicalOperator
                    });
                }

                return conditions;
            },

            rules: [
                {
                    name: 'whereQuery',
                    validate: function (params, value, state, options) {
                        for (let i = 0; i < value.length; i++) {
                            const columnSchema = schema[value[i].column];
                            const operator = value[i].operator;

                            // Check if query contains LIKE/ILIKE operator
                            if (operator === 'LIKE' || operator === 'ILIKE') {
                                // Check if column uses a string schema. This check is required because we
                                // only want to perform LIKE/ILIKE queries on columns explicitly marked as string
                                // types since non-string types (such as date) are also passed as strings.
                                if (columnSchema._type === 'string') {
                                    // Check the value is a string
                                    const result = Joi.validate(value[i].value, Joi.string());
                                    if (result.error) {
                                        return this.createError('array.whereQueryLike', {}, state, options);
                                    }

                                    // Encapsulate value in % signs which means this pattern can match anywhere
                                    value[i].value = `%${value[i].value}%`;
                                } else {
                                    return this.createError('array.whereQueryLike', {}, state, options);
                                }
                            } else {
                                // Validate the value
                                const result = Joi.validate(value[i].value, columnSchema);
                                if (result.error) {
                                    return this.createError('array.whereQueryValidate', {}, state, options);
                                }
                            }
                        }
                        return value;
                    }
                }
            ]
        }));

        const description = 'Conditions to apply to the query. Each condition must be on its own line. ' +
            'Format each condition as: `column operator value`. Example: `id = 5`. ' +
            'Supported operators are **ILIKE**, **LIKE**, **>=**, **<=**, **<>**, **!=**, **=**, **>** and **<**. ' +
            'You can also use the logical operators **AND**, **NOT** and **OR** at the end of each condition ' +
            'to combine conditions. Defaults to **AND** if not specified.';
        return customJoi.array().whereQuery().description(description);
    }

    /**
     * Returns a new Joi schema with all keys set to required. This returns the **input** schema.
     */
    getRequiredSchema() {
        const newSchema = Joi.object(this.schema.input);
        return newSchema.requiredKeys(Object.keys(this.schema.input));
    }

    /**
     * Returns the Joi schema for the ID column.
     * @param {boolean} required - If set to true, the Joi schema will set the key to required. Default is true.
     */
    getIdSchema(required = true) {
        let schema = commonSchemas.id;
        if (required) {
            schema = schema.required();
        }

        return schema;
    }

    /**
     * Returns the Joi schema for a single object returned from the database
     */
    getOutputSchema() {
        return this.schema.output;
    }

    /**
     * Returns the Joi schema for a list of objects returned from the database
     */
    getOutputArraySchema() {
        return Joi.array().items(Joi.object(this.schema.output));
    }

    /**
     * Checks whether a row exists in the database.
     * @param {number} id - The ID of the row to check.
     * @param {string} tableName - The name of the table to check. This should be the table used for writes (not a view).
     */
    async doesResourceExist(id, tableName = this.tableName) {
        const values = [id];
        const sql = `SELECT 1 FROM ${dbDataSchema}.${tableName} WHERE id = $1`;
        const data = await db.query(sql, values);

        if (data.rowCount === 0) {
            return false;
        }

        return true;
    }

    /**
     * Returns the row with the specified ID.
     * @param {number} id
     */
    async getOne(id) {
        const values = [id];
        const sql = `SELECT * FROM ${this.readTable} WHERE id = $1 LIMIT 1;`;
        const data = await db.query(sql, values);
        return data.rows[0];
    }

    /**
     * Returns a list of rows. Supports offsetting, limitting, sorting and where queries.
     * @param {*} queries
     * @param {number} queries.limit - Maximum number of rows to retrieve.
     * @param {number} queries.offset - Number of rows to skip before returning.
     * @param {string} queries.sort - The column to order the results by.
     * @param {boolean} queries.reverse - Whether to reverse the sort order. True sorts by descending order.
     * @param {*[]} queries.where - An array of objects with the following keys: column, operator and value.
     * Each entry is added to the WHERE clause in order.
     */
    async getList({ limit = queryDefaults.limit, offset = queryDefaults.offset, sort = '', reverse = queryDefaults.reverse, where = [] }) {
        let order = (reverse) ? 'DESC' : 'ASC';
        const values = [limit, offset];

        // Create WHERE clause
        const conditions = [];
        let valuesIndex = values.length + 1; // Needed to set the starting index because indices 1 and 2 are reserved for the LIMIT and OFFSET clauses
        for (let i = 0; i < where.length; i++) {
            const condition = `${where[i].column} ${where[i].operator} $${valuesIndex} ${where[i].logicalOperator}`;
            conditions.push(condition);
            values.push(where[i].value);
            valuesIndex++;
        }

        // Only create the WHERE clause if there are entries
        let whereClause = '';
        if (conditions.length > 0) {
            let tmp = conditions.toString();
            tmp = tmp.replace(/,/g, ' ');
            whereClause = `WHERE ${tmp}`;
        }

        const sql = `
            SELECT * FROM ${this.readTable}
            ${whereClause}
            ORDER BY
            ${sort} ${order}
            LIMIT $1 OFFSET $2;`;
        
        const data = await db.query(sql, values);
        return data.rows;
    }

    /**
     * Creates a new row in the database with the supplied values.
     * @param {*} params - Object containing the values to create the new row with.
     * Each key should be the column name to insert into.
     * @param {*} db - Optional client to use. Useful for operations where queries
     * must go through one client, such as transactions. If a client is not passed in,
     * the function will use a random client from the connection pool.
     */
    async create(params, client = db) {
        const values = [];
        const columns = [];
        const replace = [];
        let i = 1;

        for (const key in params) {
            values.push(params[key]);
            columns.push(key);
            replace.push(`$${i}`);
            i++;
        }

        const sql = ` 
            INSERT INTO ${this.writeTable} (${columns})
            VALUES (${replace}) RETURNING id;`;

        const data = await client.query(sql, values);
        return data.rows[0].id;
    }

    /**
     * Updates a row with the specified ID. 
     * @param {number} id - The ID of the row to update.
     * @param {*} params - Object containing the values to update. This function
     * supports partial updating so you do not need to include all columns.
     * @param {*} db - Optional client to use. Useful for operations where queries
     * must go through one client, such as transactions. If a client is not passed in,
     * the function will use a random client from the connection pool.
     */
    async update(id, params, client = db) {
        const values = [id];
        const columns = [];
        let i = 2; // Must start from 2 because 1 is reserved for the WHERE claus

        // Update only the included columns
        for (const key in params) {
            values.push(params[key]);
            columns.push(`${key}=$${i}`);
            i++;
        }

        const sql = `
            UPDATE ${this.writeTable}
            SET ${columns}
            WHERE id=$1;`;

        await client.query(sql, values);
    }
}

module.exports = Model;