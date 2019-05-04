const Joi = require('joi');

/**
 * 
 * @param {number} defaultValue 
 */
module.exports.limit = function (defaultValue = 10) {
    return Joi.number().integer().min(1).max(20).default(defaultValue);
};

/**
 * 
 * @param {number} defaultValue 
 */
module.exports.offset = function (defaultValue = 0) {
    return Joi.number().integer().min(0).default(defaultValue);
};

/**
 * 
 * @param {*} columnNames 
 */
module.exports.sort = function (columnNames = ['id']) {
    const validColumns = [...columnNames]; // Shallow copy array
    validColumns.push('id');
    return Joi.string().valid(validColumns).default('id');
};

/**
 * 
 */
module.exports.reverse = function (defaultValue = false) {
    return Joi.boolean().default(defaultValue);
};