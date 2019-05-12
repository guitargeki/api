const Joi = require('joi');
const db = require('../database');

module.exports = class Model {
    /**
     * 
     */
    constructor(tableName, inputSchema) {
        this.tableName = tableName;
        this.schema = {};

        for (const key in inputSchema) {
            // Put validation objects into new object
            this.schema[key] = inputSchema[key].validate;
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

        // Create Where clause
        const whereClauses = [];
        let valuesIndex = values.length + 1;
        for (let i = 0; i < where.length; i++) {
            const clause = `${where[i].column} ${where[i].operator} $${valuesIndex}`;
            values.push(where[i].value);
            valuesIndex++;
            whereClauses.push(clause);
        }

        const whereClaus = (whereClauses.length === 0) ? '' : `WHERE ${whereClauses.toString().replace(/,/g, ' AND ')}`;
        const sql = `
            SELECT * FROM ${this.tableName}
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

        // Update only the included columns
        for (const key in params) {
            values.push(params[key]);
            columns.push(`${key}=$${i}`);
            i++;
        }

        const sql = `
            UPDATE ${this.tableName}
            SET ${columns}
            WHERE id=$1;`;

        await db.query(sql, values);
    }
};