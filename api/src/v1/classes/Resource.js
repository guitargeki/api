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
        this.handlers = {};

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

        // Get one
        this.handlers.getOne = async function (request, h) {
            // Return 404 if resource does not exist
            const data = await model.getOne(request.params.id);
            if (data === undefined) {
                const error = Boom.notFound(codes[404]);
                return h.response(error.output.payload).code(error.output.statusCode);
            }
    
            // Return resource if found
            return h.response(data).code(200);
        };

        // Update
        this.handlers.update = async function (request, h) {
            // Return 404 if resource does not exist
            const data = await model.getOne(request.params.id);
            if (data === undefined) {
                const error = Boom.notFound(codes[404]);
                return h.response(error.output.payload).code(error.output.statusCode);
            }
    
            await model.update(request.params.id, request.payload);
            return h.response().code(204);
        };
    }
};