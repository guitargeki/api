const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/schemas');
const Model = require('../../classes/Model');

// Configure
const tableName = 'match_types';
const schema = {};

schema.input = {
    title: Joi.string().max(50),
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title
};

const modelInstance = new Model(tableName, schema);
module.exports = modelInstance;
module.exports.schema = schema;