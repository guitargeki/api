const Joi = require('joi');

const schemas = {
    id: Joi.number().integer()
};

const customJoi = Joi.extend((joi) => ({
    base: joi.number(),
    name: 'number',
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
                const result = Joi.validate(value, schemas.id);
                if (result.error) {
                    return this.createError('number.foreignKey', {}, state, options);
                }

                // Add key to foreignKeys object so the route handler can verify the key is valid
                if (!state.parent.foreignKeys) {
                    state.parent.foreignKeys = [];
                }
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