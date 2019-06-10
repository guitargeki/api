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
    score_scale: Joi.number().integer().default(-1),
    event_id: customJoi.number().foreignKey(eventModel.tableName),
    match_type_id: customJoi.number().foreignKey(matchTypeModel.tableName),
    match_status_id: customJoi.number().foreignKey(matchStatusModel.tableName),
    datetime_start: Joi.date().iso(),
    datetime_end: Joi.date().iso()
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title,
    num_submissions: Joi.number().integer(),
    score_scale: schema.input.score_scale,
    event_id: commonSchemas.id,
    event_title: eventModel.schema.input.title,
    match_type_id: commonSchemas.id,
    match_type_title: matchTypeModel.schema.input.title,
    match_status_id: commonSchemas.id,
    match_status_title: matchStatusModel.schema.input.title,
    datetime_start: schema.input.datetime_start,
    datetime_end: schema.input.datetime_end
};

const modelInstance = new Model(tableName, tableName, schema);
module.exports = modelInstance;