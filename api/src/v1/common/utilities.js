const Joi = require('joi');

/**
 * Returns a new schema with all keys set to required
 * @param {*} schema 
 */
function getRequiredSchema(schema) {
    const newSchema = Joi.object(schema);
    return newSchema.requiredKeys(Object.keys(schema));
}

module.exports = {
    getRequiredSchema
};