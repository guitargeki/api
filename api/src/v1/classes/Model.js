const Joi = require('joi');
const db = require('../database');
const commonSchemas = require('../common/schemas');

const dbDataSchema = 'geki_data';
const dbViewSchema = 'geki_view';
const limitDefault = 10;
const limitMaxDefault = 20;
const offsetDefault = 0;
const reverseDefault = false;

module.exports = class Model {
    /**
     * 
     */
    constructor(tableName, schema) {
        this.tableName = tableName;
        this.schema = {
            input: schema.input,
            output: schema.output
        };
    }

    /**
     * 
     * @param {number} defaultValue 
     */
    getLimitSchema(max = limitMaxDefault, defaultValue = limitDefault) {
        return Joi.number().integer().min(1).max(max).default(defaultValue);
    }

    /**
     * 
     * @param {number} defaultValue 
     */
    getOffsetSchema(defaultValue = offsetDefault) {
        return Joi.number().integer().min(0).default(defaultValue);
    }

    /**
     * 
     * @param {*} columnNames 
     */
    getSortSchema() {
        const validColumns = Object.keys(this.schema.output);
        return Joi.string().valid(validColumns).default(validColumns[0]);
    }

    /**
     * 
     * @param {number} defaultValue 
     */
    getReverseSchema(defaultValue = reverseDefault) {
        return Joi.boolean().default(defaultValue);
    }

    /**
     * 
     */
    getWhereSchema() {
        const schema = this.schema.output;
        let columns = Object.keys(this.schema.output).toString();
        columns = columns.replace(/,/g, '|');
        const regex = `^(${columns}) *(>=|<=|<>|!=|=|>|<) *(.+)$`;

        const customJoi = Joi.extend((joi) => ({
            base: joi.array(),
            name: 'array',
            language: {
                whereQueryCoerce: 'one or more queries are improperly formatted',
                whereQueryValidate: 'one or more queries have invalid values'
            },

            coerce: function (value, state, options) {
                // Always make the where parameter an array
                if (value) {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                } else {
                    value = [];
                }

                // Split each query into an object with the following keys: column, operator, value
                const queries = [];
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
     * Returns a new Joi schema with all keys set to required
     */
    getRequiredSchema() {
        const newSchema = Joi.object(this.schema.input);
        return newSchema.requiredKeys(Object.keys(this.schema.input));
    }

    /**
     * 
     */
    getIdSchema(required = true) {
        let schema = commonSchemas.id;
        if (required) {
            schema = schema.required();
        }

        return schema;
    }

    /**
     * 
     * @param {number} id 
     */
    async getOne(id) {
        const values = [id];
        const sql = `SELECT * FROM ${dbViewSchema}.${this.tableName} WHERE id = $1 LIMIT 1;`;
        const data = await db.query(sql, values);
        return data.rows[0];
    }

    /**
     * 
     */
    async getList({ limit = limitDefault, offset = offsetDefault, sort = '', reverse = reverseDefault, where = [] }) {
        let order = '';
        const values = [limit, offset];

        if (sort === '') {
            order = (reverse) ? 'DESC' : 'ASC';
        }

        // Create Where clause
        const whereClauses = [];
        let valuesIndex = values.length + 1;
        for (let i = 0; i < where.length; i++) {
            const clause = `${where[i].column} ${where[i].operator} $${valuesIndex}`;
            values.push(where[i].value);
            valuesIndex++;
            whereClauses.push(clause);
        }

        // Only create the WHERE claus if there are entries
        const whereClaus = (whereClauses.length === 0) ? '' : `WHERE ${whereClauses.toString().replace(/,/g, ' AND ')}`;

        const sql = `
            SELECT * FROM ${dbViewSchema}.${this.tableName}
            ${whereClaus}
            ORDER BY
            ${sort} ${order}
            LIMIT $1 OFFSET $2;`;

        const data = await db.query(sql, values);
        return data.rows;
    }

    /**
     * 
     * @param {*} params 
     */
    async create(params) {
        const values = [];
        const columns = [];
        const replace = [];
        let i = 1;

        // 
        for (const key in params) {
            values.push(params[key]);
            columns.push(key);
            replace.push(`$${i}`);
            i++;
        }

        const sql = `
            INSERT INTO ${dbDataSchema}.${this.tableName} (${columns})
            VALUES (${replace}) RETURNING id;`;

        const data = await db.query(sql, values);
        return data.rows[0].id;
    }

    /**
     * 
     * @param {*} id 
     * @param {*} params 
     */
    async update(id, params) {
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
            UPDATE ${dbDataSchema}.${this.tableName}
            SET ${columns}
            WHERE id=$1;`;

        await db.query(sql, values);
    }
};