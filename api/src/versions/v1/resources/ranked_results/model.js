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
    winner: participantModel.schema.input.username,
    winner_new_elo: participantModel.schema.input.elo,
    winner_old_elo: participantModel.schema.input.elo,
    loser_id: commonSchemas.id,
    loser: participantModel.schema.input.username,
    loser_new_elo: participantModel.schema.input.elo,
    loser_old_elo: participantModel.schema.input.elo,
    datetime_submitted: schema.input.datetime_submitted
};
const modelInstance = new Model(tableName, tableName, schema);

/**
 * 
 */
modelInstance.submitResult = async function ({ match_id, winner_id, loser_id, datetime_submitted }) {
    // Get a single client from the pool since all statements within a transaction must come from the same client.
    // Note: we don't try/catch this because if connecting throws an exception,
    // we don't need to dispose of the client (it will be undefined)
    const client = await db.pool.connect();

    try {
        let sql = 'BEGIN;';
        await client.query(sql);

        // Lock the table from all writes. Reads still work.
        sql = `LOCK TABLE ${modelInstance.writeTable} IN EXCLUSIVE MODE;`;
        await client.query(sql);

        // Get winner's current Elo
        sql = `
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
        
        // Insert ranked result
        const data = {
            match_id,
            winner_id,
            winner_new_elo: winnerNewElo,
            winner_old_elo: winnerOldElo,
            loser_id,
            loser_new_elo: loserNewElo,
            loser_old_elo: loserOldElo,
            datetime_submitted
        };
        const rankedResultId = await modelInstance.create(data, client);

        // Update Elos
        await participantModel.update(winner_id, { elo: winnerNewElo });
        await participantModel.update(loser_id, { elo: loserNewElo });

        await client.query('COMMIT;');

        results = await modelInstance.getOne(rankedResultId);
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

module.exports = modelInstance;