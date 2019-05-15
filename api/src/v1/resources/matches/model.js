const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/schemas').schemas;
const Model = require('../../classes/Model');

// Referenced schemas
const eventSchema = require('../events').schema;
const matchTypeSchema = require('../match_types').schema;
const matchStatusSchema = require('../match_statuses').schema;

// Configure
const tableName = 'matches';
const schema = {};

schema.input = {
    title: Joi.string().max(200),
    event_id: commonSchemas.id,
    match_type_id: commonSchemas.id,
    match_status_id: commonSchemas.id
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title,
    num_submissions: Joi.number().integer(),
    event_id: schema.input.event_id,
    event_title: eventSchema.input.title,
    match_type_id: schema.input.match_type_id,
    match_type: matchTypeSchema.input.title,
    match_status_id: schema.input.match_status_id,
    match_status: matchStatusSchema.input.title,
};

const modelInstance = new Model(tableName, schema);
module.exports = modelInstance;
module.exports.schema = schema;