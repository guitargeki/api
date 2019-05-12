const Joi = require('joi');
const db = require('../database');
const Model = require('../classes/Model');

// Configure
const tableName = 'participants';
const inputSchema = {
    username: { 
        validate: Joi.string().regex(/^[a-zA-Z0-9 _-]+$/).min(2).max(32)
    },
    avatar_url: {
        validate: Joi.string().uri().max(200)
    },
    is_team: {
        validate: Joi.boolean()
    },
    elo: {
        validate: Joi.number().min(-1).max(10000)
    }
};
const outputSchema = inputSchema;

const modelInstance = new Model(tableName, inputSchema);
module.exports = modelInstance;
module.exports.schema = {
    inputSchema
};