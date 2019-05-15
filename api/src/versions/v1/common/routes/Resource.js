const Boom = require('@hapi/boom');
const codes = require('./http-codes');
const auth = require('./auth');

module.exports = class Resource {
    /**
     * 
     * @param {*} resourceName 
     * @param {*} model 
     */
    constructor(resourceName, model) {
        this.resourceName = resourceName;
        this.model = model;
        this.pre = {};
        this.handlers = {};
        this.routes = [];

        const basePath = `/${resourceName}`;
        const tags = ['api', resourceName];

        // PRE HANDLER - Check if a resource exists. If it doesn't exist, it will return a 404.
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

        // PRE HANDLER - Check if all foreign keys point to an existing record. Return 422 if any keys point to a non-existing record.
        this.pre.checkForeignKeysExist = {
            method: async function (request, h) {
                const foreignKeys = request.payload.foreignKeys;
                if (foreignKeys) {
                    for (let i = 0; i < foreignKeys.length; i++) {
                        const id = foreignKeys[i].value;
                        const tableName = foreignKeys[i].table;
                        const key = foreignKeys[i].key;
                        const exists = await model.doesResourceExist(id, tableName);

                        if (!exists) {
                            const error = Boom.badData(`${key} does not point to an existing resource`);
                            return h.response(error.output.payload).code(error.output.statusCode).takeover();
                        }
                    }

                    // Delete foreignKeys to restore payload to its original state
                    delete request.payload.foreignKeys;
                }

                return null;
            },
            assign: 'checkForeignKeysExist',
            failAction: 'error'
        };

        // HANDLER - Get one
        this.handlers.getOne = async function (request, h) {
            const data = await model.getOne(request.params.id);
            return h.response(data).code(200);
        };

        // HANDLER - Get list
        this.handlers.getList = async function (request, h) {
            const data = await model.getList(request.query);
            return h.response(data).code(200);
        };

        // HANDLER - Create
        this.handlers.create = async function (request, h) {
            // ID of the new resource
            const id = await model.create(request.payload);

            // Set 'Location' header to the URL for the new resource
            const response = h.response().code(201);
            response.header('Location', `${request.path}/${id}`);
            return response;
        };

        // HANDLER - Update
        this.handlers.update = async function (request, h) {
            await model.update(request.params.id, request.payload);
            return h.response().code(204);
        };

        this.routes = [
            // ROUTE - Get list
            {
                method: 'GET',
                path: basePath,
                handler: this.handlers.getList,
                options: {
                    tags: tags,
                    validate: {
                        query: {
                            limit: model.getLimitSchema(),
                            offset: model.getOffsetSchema(),
                            sort: model.getSortSchema(),
                            reverse: model.getReverseSchema(),
                            where: model.getWhereSchema()
                        }
                    }
                }
            },

            // ROUTE - Create
            {
                method: 'POST',
                path: basePath,
                handler: this.handlers.create,
                options: {
                    auth: {
                        strategy: auth.strategy,
                        scope: auth.scopes.admin
                    },
                    tags: tags,
                    validate: {
                        payload: model.getRequiredSchema()
                    },
                    pre: [
                        this.pre.checkForeignKeysExist
                    ]
                }
            },

            // ROUTE - Get one
            {
                method: 'GET',
                path: basePath + '/{id}',
                handler: this.handlers.getOne,
                options: {
                    tags: tags,
                    validate: {
                        params: {
                            id: model.getIdSchema()
                        }
                    },
                    pre: [
                        this.pre.checkResourceExists
                    ]
                }
            },

            // ROUTE - Update
            {
                method: 'PATCH',
                path: basePath + '/{id}',
                handler: this.handlers.update,
                options: {
                    auth: {
                        strategy: auth.strategy,
                        scope: auth.scopes.admin
                    },
                    tags: tags,
                    validate: {
                        params: {
                            id: model.getIdSchema()
                        },
                        payload: model.schema.input
                    },
                    pre: [
                        this.pre.checkResourceExists,
                        this.pre.checkForeignKeysExist
                    ]
                }
            }
        ];
    }
};