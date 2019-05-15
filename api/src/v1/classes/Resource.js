const Joi = require('joi');
const Boom = require('@hapi/boom');
const codes = require('../common/http-codes');

module.exports = class Resource {
    /**
     * 
     * @param {*} basePath 
     * @param {*} model 
     */
    constructor(model) {
        this.pre = {};
        this.handlers = {};

        // Pre handler to check if a resource exists. If it doesn't exist, it will return a 404.
        this.pre.checkResourceExists = {
            method: async function (request, h) {
                const exists = await model.doesResourceExist(request.params.id);
                if (!exists) {
                    const error = Boom.notFound(codes[404]);
                    return h.response(error.output.payload).code(error.output.statusCode).takeover();
                }

                return null;
            },
            assign: 'checkResourceExists',
            failAction: 'error'
        };

        // Pre handler to check if all foreign keys point to an existing record. Return 422 if any keys point to a non-existing record.
        this.pre.checkForeignKeysExist = {
            method: async function (request, h) {
                if (request.payload.foreignKeys) {
                    const foreignKeys = request.payload.foreignKeys;

                    for (let i = 0; i < foreignKeys.length; i++) {
                        const id = foreignKeys[i].value;
                        const tableName = foreignKeys[i].table;
                        const key = foreignKeys[i].key;
                        const exists = await model.doesResourceExist(id, tableName);

                        if (!exists) {
                            const error = Boom.badData(`${key} does not point to an existing resource`, foreignKeys[i].key);
                            return h.response(error.output.payload).code(error.output.statusCode).takeover();
                        }
                    }

                    delete request.payload.foreignKeys;
                }

                return null;
            },
            assign: 'checkForeignKeysExist',
            failAction: 'error'
        };

        // Get one
        this.handlers.getOne = async function (request, h) {
            const data = await model.getOne(request.params.id);
            return h.response(data).code(200);
        };

        // Get list
        this.handlers.getList = async function (request, h) {
            const data = await model.getList(request.query);
            return h.response(data).code(200);
        };

        // Create
        this.handlers.create = async function (request, h) {
            // ID of the new resource
            const id = await model.create(request.payload);

            // Set 'Location' header to the URL for the new resource
            const response = h.response().code(201);
            response.header('Location', `${request.path}/${id}`);
            return response;
        };

        // Update
        this.handlers.update = async function (request, h) {
            await model.update(request.params.id, request.payload);
            return h.response().code(204);
        };
    }
};