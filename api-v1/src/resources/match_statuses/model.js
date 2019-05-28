const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const Model = require('../../common/models/Model');

// Configure
const tableName = 'match_statuses';
const schema = {};

schema.input = {
    title: Joi.string().max(50),
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title
};

const modelInstance = new Model(tableName, tableName, schema);
module.exports = modelInstance;