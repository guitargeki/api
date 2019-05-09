const Joi = require('joi');
const db = require('../database');
const Model = require('./Model');

const tableName = 'participants';
const modelInstance = new Model(tableName, {
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
        mapping: 'global_elo',
        validate: Joi.number().min(-1).max(10000)
    }
});
module.exports = modelInstance;