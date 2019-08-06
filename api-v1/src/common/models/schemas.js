const Joi = require('joi');

/**
 * Common Joi schemas that are used across multiple models.
 */
const schemas = {
    id: Joi.number().integer()
};

/**
 * Extend Joi to add a new validator for foreign keys. It accepts a table name
 * as a parameter, which is then later queried to check the foreign key exists.
 * Note that this validator does not perform the actual check. It simply
 * creates a foreignKeys array in the request payload, which is later used by
 * a route pre-handler to perform the actual checking.
 */
const customJoi = Joi.extend((joi) => ({
    base: schemas.id,
    name: 'id',
    language: {
        foreignKey: 'there was an error'
    },

    rules: [
        {
            name: 'foreignKey',
            params: {
                tableName: Joi.string()
            },
            validate: function (params, value, state, options) {
                // Check that ID matches the ID schema
                const result = Joi.validate(value, schemas.id);
                if (result.error) {
                    return this.createError('id.foreignKey', {}, state, options);
                }

                
                // Create a foreignKeys array in the request payload (if it doesn't exist)
                if (!state.parent.foreignKeys) {
                    state.parent.foreignKeys = [];
                }

                // Add key to foreignKeys array. Later, a route pre-handler uses this array
                // and checks that each key exists.
                state.parent.foreignKeys.push({
                    table: params.tableName,
                    key: state.key,
                    value: value
                });

                return value;
            }
        }
    ]
}));

module.exports.schemas = schemas;
module.exports.customJoi = customJoi;