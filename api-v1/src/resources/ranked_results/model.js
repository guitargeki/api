const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const customJoi = require('../../common/models/schemas').customJoi;
const Model = require('../../common/models/Model');
const elo = require('../../common/models/elo');

// Referenced models
const matchModel = require('../matches').model;
const participantModel = require('../participants').model;

// Configure
const tableName = 'ranked_results';
const schema = {};
schema.input = {
    match_id: customJoi.number().foreignKey(matchModel.tableName),
    winner_id: customJoi.number().foreignKey(participantModel.tableName),
    loser_id: customJoi.number().foreignKey(participantModel.tableName),
    datetime_submitted: Joi.date().iso()
};
schema.output = {
    id: commonSchemas.id,
    match_id: commonSchemas.id,
    match_title: matchModel.schema.input.title,
    winner_id: commonSchemas.id,
    winner_username: participantModel.schema.input.username,
    winner_new_elo: participantModel.schema.input.elo,
    winner_old_elo: participantModel.schema.input.elo,
    loser_id: commonSchemas.id,
    loser_username: participantModel.schema.input.username,
    loser_new_elo: participantModel.schema.input.elo,
    loser_old_elo: participantModel.schema.input.elo,
    datetime_submitted: schema.input.datetime_submitted
};
const modelInstance = new Model(tableName, tableName, schema);

/**
 * Update Elos for both participants and returns an object containing new and old Elos.
 * @param {*} winner_id 
 * @param {*} loser_id 
 * @param {*} client - Client to use when executing queries.
 */
async function updateElo(winner_id, loser_id, client) {
    // Get winner's current Elo
    const sql = `
        SELECT elo
        FROM ${participantModel.writeTable}
        WHERE id = $1
        LIMIT 1;`;
    let values = [winner_id];
    let results = await client.query(sql, values);
    const winnerOldElo = results.rows[0].elo;

    // Get loser's current Elo
    values = [loser_id];
    results = await client.query(sql, values);
    const loserOldElo = results.rows[0].elo;

    // Calculate new Elos
    const winnerNewElo = elo.getNewElo(winnerOldElo, loserOldElo, 1);
    const loserNewElo = elo.getNewElo(loserOldElo, winnerOldElo, 0);

    // Update Elos
    await participantModel.update(winner_id, { elo: winnerNewElo }, client);
    await participantModel.update(loser_id, { elo: loserNewElo }, client);

    return {
        winnerNewElo,
        winnerOldElo,
        loserNewElo,
        loserOldElo
    };
}

/**
 * Set match's status to Completed and update its end date.
 * @param {*} id 
 * @param {*} datetime_end 
 * @param {*} client - Client to use when executing queries.
 */
async function updateMatch(id, datetime_end, client) {
    const values = [id, 4, datetime_end];

    const sql = `
        UPDATE ${matchModel.writeTable}
        SET match_status_id=$2,
            datetime_end=$3
        WHERE id=$1;`;
    
    await client.query(sql, values);
}

/**
 * Updates Elos for both participants, creates a new ranked result and marks the match as Completed.
 */
modelInstance.submitResult = async function ({ match_id, winner_id, loser_id, datetime_submitted }) {
    // Get a single client from the pool since all statements within a transaction must come from the same client.
    // Note: we don't try/catch this because if connecting throws an exception,
    // we don't need to dispose of the client (it will be undefined)
    const client = await db.pool.connect();

    try {
        let sql = 'BEGIN;';
        await client.query(sql);

        // Lock the results table from all writes. Reads still work.
        sql = `LOCK TABLE ${modelInstance.writeTable} IN EXCLUSIVE MODE;`;
        await client.query(sql);

        // Update Elos and return old and new Elos
        const elos = await updateElo(winner_id, loser_id, client);

        // Insert ranked result
        const data = {
            match_id,
            winner_id,
            winner_new_elo: elos.winnerNewElo,
            winner_old_elo: elos.winnerOldElo,
            loser_id,
            loser_new_elo: elos.loserNewElo,
            loser_old_elo: elos.loserOldElo,
            datetime_submitted
        };
        const rankedResultId = await modelInstance.create(data, client);
        
        // Mark match as Completed and update its end date
        await updateMatch(match_id, datetime_submitted, client);

        await client.query('COMMIT;');
        const results = await modelInstance.getOne(rankedResultId);
        return results;

    } catch (error) {
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        // Put client back into the connection pool. Must be done otherwise, connections will leak
        // and the pool will eventually be empty.
        client.release();
    }
};

/**
 * Recalculate all Elos. Useful for seeing effects of different K values.
 */
modelInstance.recalculateAllElos = async function () {
    const client = await db.pool.connect();

    try {
        let results;
        let sql = 'BEGIN;';
        await client.query(sql);

        // Lock the results table from all writes. Reads still work.
        sql = `LOCK TABLE ${modelInstance.writeTable} IN EXCLUSIVE MODE;`;
        await client.query(sql);

        // Reset all Elos to starting Elo
        sql = `
            UPDATE ${participantModel.writeTable}
            SET elo = ${elo.startingElo}
            WHERE elo > 0;`;
        await client.query(sql);

        // Get all results ordered by datetime submitted
        sql = `
            SELECT * FROM ${modelInstance.writeTable}
            ORDER BY datetime_submitted ASC;`;
        results = await client.query(sql);
        results = results.rows;

        // Recalculate all results
        for (const result of results) {
            // Update and return Elos
            const elos = await updateElo(result.winner_id, result.loser_id, client);
            const data = {
                winner_new_elo: elos.winnerNewElo,
                winner_old_elo: elos.winnerOldElo,
                loser_new_elo: elos.loserNewElo,
                loser_old_elo: elos.loserOldElo
            };

            // Update ranked result row
            await modelInstance.update(result.id, data, client);

            // Mark match as Completed and update its end date
            await updateMatch(result.match_id, result.datetime_submitted, client);
        }

        await client.query('COMMIT;');

    } catch (error) {
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = modelInstance;