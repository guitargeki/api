const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('./schemas').schemas;
const dbDataSchema = process.env.DB_DATA_SCHEMA;
const dbViewSchema = process.env.DB_VIEW_SCHEMA;

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
        return Joi.number().integer().min(1).max(max).default(defaultValue);
    }

    /**
     * Returns the Joi schema for the offset query.
     * @param {number} defaultValue 
     */
    getOffsetSchema(defaultValue = queryDefaults.offset) {
        return Joi.number().integer().min(0).default(defaultValue);
    }

    /**
     * Returns the Joi schema for the sort query. The valid columns are determined by
     * the output schema passed in at construction.
     */
    getSortSchema() {
        const validColumns = Object.keys(this.schema.output);
        return Joi.string().valid(validColumns).default(validColumns[0]);
    }

    /**
     * Returns the Joi schema for the reverse query.
     * @param {number} defaultValue 
     */
    getReverseSchema(defaultValue = queryDefaults.reverse) {
        return Joi.boolean().default(defaultValue);
    }

    /**
     * Returns the Joi schema for where query. Each where query can specify one
     * column (valid columns determined by the output schema), an operator and 
     * a value.
     * @example where=elo>1400
     */
    getWhereSchema() {
        const schema = this.schema.output;
        let columns = Object.keys(schema).toString();
        columns = columns.replace(/,/g, '|');
        const regex = `^(${columns}) *(>=|<=|<>|!=|=|>|<) *(.+)$`;

        // Extend Joi to add a custom validator
        const customJoi = Joi.extend((joi) => ({
            base: joi.array(),
            name: 'array',
            language: {
                whereQueryCoerce: 'one or more queries are improperly formatted',
                whereQueryValidate: 'one or more queries have invalid values'
            },

            coerce: function (value, state, options) {
                const queries = [];

                // Always make the where parameter an array
                if (value) {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                } else {
                    value = [];
                }

                // Split each query into an object with the following keys: column, operator, value
                for (let i = 0; i < value.length; i++) {
                    const matchResult = value[i].match(regex);
                    if (!matchResult) {
                        return this.createError('array.whereQueryCoerce', {}, state, options);
                    }

                    queries.push({
                        column: matchResult[1],
                        operator: matchResult[2],
                        value: matchResult[3]
                    });
                }

                return queries;
            },

            rules: [
                {
                    name: 'whereQuery',
                    validate: function (params, value, state, options) {
                        for (let i = 0; i < value.length; i++) {
                            const result = Joi.validate(value[i].value, schema[value[i].column]);
                            if (result.error) {
                                return this.createError('array.whereQueryValidate', {}, state, options);
                            }
                        }
                        return value;
                    }
                }
            ]
        }));

        return customJoi.array().whereQuery();
    }

    /**
     * Returns a new Joi schema with all keys set to required.
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
        const whereClauses = [];
        let valuesIndex = values.length + 1;
        for (let i = 0; i < where.length; i++) {
            const clause = `${where[i].column} ${where[i].operator} $${valuesIndex}`;
            values.push(where[i].value);
            valuesIndex++;
            whereClauses.push(clause);
        }

        // Only create the WHERE claus if there are entries
        let whereClausString = '';
        if (whereClauses.length > 0) {
            // Easy way to insert AND statements between each condition
            let temp = whereClauses.toString();
            temp = temp.replace(/,/g, ' AND ');

            whereClausString = `WHERE ${temp}`;
        }

        const sql = `
            SELECT * FROM ${this.readTable}
            ${whereClausString}
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
        let i = 2;

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