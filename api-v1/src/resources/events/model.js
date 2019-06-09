const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const Model = require('../../common/models/Model');

// Configure
const tableName = 'events';
const schema = {};

schema.input = {
    title: Joi.string().max(200),
    datetime_start: Joi.date().iso(),
    datetime_end: Joi.date().iso()
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title,
    matches: Joi.number().integer(),
    datetime_start: schema.input.datetime_start,
    datetime_end: schema.input.datetime_end
};

const modelInstance = new Model(tableName, tableName, schema);
module.exports = modelInstance;