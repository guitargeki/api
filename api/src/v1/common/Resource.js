const codes = require('../common/http-codes');

module.exports = class Resource {
    /**
     * 
     * @param {*} basePath 
     * @param {*} model 
     */
    constructor(basePath, model) {
        this.routes = {};

        // Get one
        this.routes.getOne = {
            method: 'GET',
            path: basePath + '/{id}',
        
            handler: async function (request, h) {
                // Return 404 if resource does not exist
                const data = await model.getOne(request.params.id);
                if (data === undefined) {
                    return h.response(codes[404]).code(404);
                }
        
                // Return resource if found
                return h.response(data).code(200);
            },
        
            options: {
                tags: ['api'],
                validate: {
                    params: {
                        id: model.getIdSchema()
                    }
                }
            }
        };

        // Get list
        this.routes.getList = {
            method: 'GET',
            path: basePath,
        
            handler: async function (request, h) {
                const data = await model.getList(request.query);
                return h.response(data).code(200);
            },
        
            options: {
                tags: ['api'],
                validate: {
                    query: {
                        limit: model.getLimit(),
                        offset: model.getOffset(),
                        sort: model.getSort(),
                        reverse: model.getReverse()
                    }
                }
            }
        };

        // Create
        this.routes.create = {
            method: 'POST',
            path: basePath,
        
            handler: async function (request, h) {
                // ID of the new resource
                const id = await model.create(request.payload);
        
                // Set 'Location' header to the URL for the new resource
                const response = h.response(codes[201]).code(201);
                response.header('Location', `${request.path}/${id}`);
                return response;
            },
        
            options: {
                tags: ['api'],
                validate: {
                    payload: model.getRequiredSchema()
                }
            }
        };

        this.routes.update = {
            method: 'PATCH',
            path: basePath + '/{id}',
        
            handler: async function (request, h) {
                // Return 404 if resource does not exist
                const data = await model.getOne(request.params.id);
                if (data === undefined) {
                    return h.response(codes[404]).code(404);
                }
        
                await model.update(request.params.id, request.payload);
                return h.response().code(204);
            },
        
            options: {
                tags: ['api'],
                validate: {
                    params: {
                        id: model.getIdSchema()
                    },
                    payload: model.schema
                }
            }
        };
    }
};