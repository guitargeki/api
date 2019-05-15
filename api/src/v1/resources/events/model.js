const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/schemas').schemas;
const Model = require('../../classes/Model');

// Configure
const tableName = 'events';
const schema = {};

schema.input = {
    title: Joi.string().max(200),
    date_start: Joi.date().iso(),
    date_end: Joi.date().iso()
};

schema.output = {
    id: commonSchemas.id,
    num_matches: Joi.number().integer(),
    date_start: schema.input.date_start,
    date_end: schema.input.date_end
};

const modelInstance = new Model(tableName, schema);
module.exports = modelInstance;
module.exports.schema = schema;