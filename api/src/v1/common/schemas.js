const Joi = require('joi');

const schemas = {
    id: Joi.number().integer()
};

module.exports.schemas = schemas;