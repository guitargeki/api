const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/models/schemas').schemas;
const Model = require('../../common/models/Model');

// Configure
const tableName = 'series';
const schema = {};

schema.input = {
    title: Joi.string().max(200),
    alternative_title: Joi.string().max(200)
};

schema.output = {
    id: commonSchemas.id,
    title: schema.input.title,
    alternative_title: schema.input.alternative_title
};

const modelInstance = new Model(tableName, schema);
module.exports = modelInstance;