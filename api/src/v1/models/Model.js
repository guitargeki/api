const Joi = require('joi');
const db = require('../database');

module.exports = class Model {
    /**
     * 
     * @param {*} params 
     */
    constructor(tableName, schema) {
        this.tableName = tableName;
        this.mappings = {};
        this.mappings.id = 'id';
        this.schema = {};

        for (const key in schema) {
            // Put mappings into a new object where the key is the API column name and the value is the database column name
            if (schema[key].mapping === undefined) {
                // If 'mapping' key is missing, use parent key as the mapping
                this.mappings[key] = key;
            } else {
                this.mappings[key] = schema[key].mapping;
            }

            // Put validation objects into new object
            this.schema[key] = schema[key].validate;
        }
    }

    /**
     * 
     * @param {number} defaultValue 
     */
    getLimitSchema(defaultValue = 10) {
        return Joi.number().integer().min(1).max(20).default(defaultValue);
    }

    /**
     * 
     * @param {number} defaultValue 
     */
    getOffsetSchema(defaultValue = 0) {
        return Joi.number().integer().min(0).default(defaultValue);
    }

    /**
     * 
     * @param {*} columnNames 
     */
    getSortSchema() {
        const validColumns = [...Object.keys(this.schema)]; // Shallow copy array
        validColumns.push('id');
        return Joi.string().valid(validColumns).default('id');
    }

    /**
     * 
     * @param {number} defaultValue 
     */
    getReverseSchema(defaultValue = false) {
        return Joi.boolean().default(defaultValue);
    }

    /**
     * 
     */
    getWhereSchema() {
        return async function (value) {
            
        };
    }

    /**
     * Returns a new Joi schema with all keys set to required
     * @param {*} schema 
     */
    getRequiredSchema() {
        const newSchema = Joi.object(this.schema);
        return newSchema.requiredKeys(Object.keys(this.schema));
    }

    /**
     * 
     */
    getIdSchema(required = true) {
        let schema = Joi.number().integer();
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
        const sql = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1;`;
        const data = await db.query(sql, values);
        return data.rows[0];
    }

    /**
     * 
     */
    async getList({ limit = 10, offset = 0, sort = 'id', reverse = false, where = [] }) {
        const order = (reverse) ? 'DESC' : 'ASC';
        const values = [limit, offset];
        sort = this.mappings[sort];

        // Create Where clause
        const whereClauses = [];
        let valuesIndex = values.length + 1;
        for (let i = 0; i < where.length; i++) {
            const column = this.mappings[where[i].column];
            const clause = `${column} ${where[i].operator} $${valuesIndex}`;
            values.push(where[i].value);
            valuesIndex++;
            whereClauses.push(clause);
        }

        const sql = `
            SELECT * FROM ${this.tableName}
            WHERE ${whereClauses.toString().replace(/,/g, ' AND ')}
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
            if (this.mappings[key] !== undefined) {
                values.push(params[key]);
                columns.push(this.mappings[key]);
                replace.push(`$${i}`);
                i++;
            }
        }

        const sql = `
            INSERT INTO ${this.tableName} (${columns})
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

        // 
        for (const key in params) {
            if (this.mappings[key] !== undefined) {
                values.push(params[key]);
                columns.push(`${this.mappings[key]}=$${i}`);
                i++;
            }
        }

        const sql = `
            UPDATE ${this.tableName}
            SET ${columns}
            WHERE id=$1;`;

        await db.query(sql, values);
    }
};