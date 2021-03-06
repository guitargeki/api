const config = require('../common/config');
const { Pool } = require('pg');
const pool = new Pool({
    host: config.vars.database.HOST,
    port: config.vars.database.PORT,
    database: config.vars.database.DATABASE,
    user: config.vars.database.users.api.NAME,
    password: config.vars.database.users.api.PASSWORD
});

/**
 * Executes a parameterized query using a random client from the connection pool.
 * DO NOT USE WITH TRANSACTIONS. Transactions **must** use a single client.
 * @param {*} query - The SQL query to execute.
 * @param {*} params - Array of values to pass into the query.
 */
function query(query, params) {
    return pool.query(query, params).catch(error => {
        throw error;
    });
}

module.exports = {
    pool,
    query
};