const { Pool } = require('pg');
const pool = new Pool();

/**
 * 
 * @param {*} query 
 * @param {*} params 
 */
function query(query, params) {
    return pool.query(query, params).catch(error => {
        console.log(error);
        throw error;
    });
}

module.exports = {
    query
};