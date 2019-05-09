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
     * Returns a new Joi schema with all keys set to required
     * @param {*} schema 
     */
    getRequiredSchema() {
        const newSchema = Joi.object(this.schema);
        return newSchema.requiredKeys(Object.keys(this.schema));
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
    async getList({ limit = 10, offset = 0, sort = 'id', reverse = false, where = {} }) {
        const order = (reverse) ? 'DESC' : 'ASC';
        const values = [limit, offset];
        const sql = `
            SELECT * FROM ${this.tableName}
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