const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const customJoi = require('../../common/models/schemas').customJoi;
const Model = require('../../common/models/Model');

// Referenced models
const matchModel = require('../matches').model;
const participantModel = require('../participants').model;

// Configure
const tableName = 'scored_results';
const schema = {};

schema.input = {
    match_id: customJoi.id().foreignKey(matchModel.tableName),
    participant_id: customJoi.id().foreignKey(participantModel.tableName),
    score: Joi.number(),
    datetime_submitted: Joi.date().iso()
};

schema.output = {
    id: commonSchemas.id,
    match_id: commonSchemas.id,
    match_title: matchModel.schema.input.title,
    participant_id: commonSchemas.id,
    participant_username: participantModel.schema.input.username,
    score: schema.input.score,
    datetime_submitted: schema.input.datetime_submitted
};

const modelInstance = new Model(tableName, tableName, schema);
module.exports = modelInstance;