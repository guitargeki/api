const Joi = require('joi');
const db = require('../../database');
const commonSchemas = require('../../common/schemas');
const Model = require('../../classes/Model');

// Configure
const tableName = 'participants';
const schema = {};

schema.input = {
    username: Joi.string().regex(/^[a-zA-Z0-9 _-]+$/).min(2).max(32),
    avatar_url: Joi.string().uri().max(200),
    is_team: Joi.boolean(),
    elo: Joi.number().min(-1).max(10000)
};

schema.output = {
    id: commonSchemas.id,
    ...schema.input,
    wins: Joi.number().integer().min(0),
    losses: Joi.number().integer().min(0)
};

const modelInstance = new Model(tableName, schema.input, schema.output);
module.exports = modelInstance;
module.exports.schema = schema;