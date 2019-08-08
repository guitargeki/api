const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const customJoi = require('../../common/models/schemas').customJoi;
const Model = require('../../common/models/Model');

// Referenced models
const matchModel = require('../matches').model;
const participantModel = require('../participants').model;
const seriesModel = require('../series').model;

// Configure
const tableName = 'submissions';
const schema = {};

schema.input = {
    match_id: customJoi.id().foreignKey(matchModel.tableName),
    participant_id: customJoi.id().foreignKey(participantModel.tableName),
    series_id: customJoi.id().foreignKey(seriesModel.tableName),
    title: Joi.string().max(200),
    description: Joi.string().max(2000).allow(''),
    submission_url: Joi.string().uri().max(300),
    datetime_submitted: Joi.date().iso()
};

schema.output = {
    id: commonSchemas.id,
    match_id: commonSchemas.id,
    match_title: matchModel.schema.input.title,
    participant_id: commonSchemas.id,
    participant_username: participantModel.schema.input.username,
    series_id: commonSchemas.id,
    series_title: seriesModel.schema.input.title,
    title: schema.input.title,
    description: schema.input.description,
    submission_url: schema.input.submission_url,
    datetime_submitted: schema.input.datetime_submitted
};

const modelInstance = new Model(tableName, tableName, schema);
module.exports = modelInstance;