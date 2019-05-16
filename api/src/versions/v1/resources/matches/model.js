const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const customJoi = require('../../common/models/schemas').customJoi;
const Model = require('../../common/models/Model');

// Referenced models
const eventModel = require('../events').model;
const matchTypeModel = require('../match_types').model;
const matchStatusModel = require('../match_statuses').model;

// Configure
const tableName = 'matches';
const schema = {};

schema.input = {
    title: Joi.string().max(200),
    event_id: customJoi.number().foreignKey(eventModel.tableName),
    match_type_id: customJoi.number().foreignKey(matchTypeModel.tableName),
    match_status_id: customJoi.number().foreignKey(matchStatusModel.tableName)
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title,
    num_submissions: Joi.number().integer(),
    event_id: commonSchemas.id,
    event_title: eventModel.schema.input.title,
    match_type_id: commonSchemas.id,
    match_type: matchTypeModel.schema.input.title,
    match_status_id: commonSchemas.id,
    match_status: matchStatusModel.schema.input.title,
};

const modelInstance = new Model(tableName, tableName, schema);
module.exports = modelInstance;