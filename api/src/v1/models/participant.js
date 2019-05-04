const db = require('../database');
const queries = require('../common/queries');

const tableName = 'participants';

/**
 * 
 * @param {*} id 
 */
async function getOne(id) {
    const params = [id];
    const sql = `SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1;`;
    const data = await db.query(sql, params);
    return data.rows[0];
}

/**
 * 
 */
async function getList({ limit = 10, offset = 0, sort = ['id'], where = {}}) {
    let orderby = 'ORDER BY\n';
    for (let i = 0; i < sort.length; i++) {
        if (queries.isValidSort(sort[i], true)) {
            orderby += sort[i];
            orderby += ' ASC';
        } else if (queries.isValidSort(sort[i], false)) {
            orderby += sort[i];
            orderby += ' DESC';
        } else {
            continue;
        }

        if (i !== sort.length - 1) {
            orderby += ',\n';
        }
    }

    const params = [limit, offset];
    const sql = `
        SELECT * FROM ${tableName}
        ${orderby}
        LIMIT $1 OFFSET $2;
    `;

    console.log(sql);

    const data = await db.query(sql, params);
    return data.rows;
}

/**
 * 
 */
async function create({ username, avatar_url, is_team, global_elo }) {
    const params = [username, avatar_url, is_team, global_elo];
    const sql = `
        INSERT INTO ${tableName} (username, avatar_url, is_team, global_elo)
        VALUES ($1, $2, $3, $4) RETURNING id;`;

    const data = await db.query(sql, params);
    return data.rows[0].id;
}

/**
 * 
 */
async function update({ id, username, avatar_url, is_team, global_elo }) {
    const params = [id, username, avatar_url, is_team, global_elo];
    const sql = `
        UPDATE ${tableName}
        SET username=$2, avatar_url=$3, is_team=$4, global_elo=$5
        WHERE id=$1;
    `;

    await db.query(sql, params);
}

module.exports = {
    getOne,
    getList,
    create,
    update
};