const Boom = require('@hapi/boom');
const codes = require('./http-codes');
const auth = require('./auth');

class Resource {
    /**
     * 
     * @param {*} resourceName - The name to use as the endpoint.
     * @param {*} model - The Model object to use.
     */
    constructor(resourceName, model) {
        this.resourceName = resourceName;
        this.model = model;
        this.pre = {};
        this.handlers = {};
        this.routes;
        this.basePath = `/${resourceName}`;
        this.tags = ['api', resourceName];

        // PRE HANDLER - Check if a resource exists. If it doesn't exist, it will return a 404.
        this.pre.checkResourceExists = {
            method: async function (request, h) {
                const exists = await model.doesResourceExist(request.params.id);
                if (!exists) {
                    throw Boom.notFound(codes[404]);
                }

                return null;
            },
            assign: 'checkResourceExists',
            failAction: 'error'
        };

        // PRE HANDLER - Check if all foreign keys point to an existing record. Return 422 if any keys point to a non-existing record.
        this.pre.checkForeignKeysExist = {
            method: async function (request, h) {
                // 
                const foreignKeys = request.payload.foreignKeys;
                if (foreignKeys) {
                    for (let i = 0; i < foreignKeys.length; i++) {
                        const id = foreignKeys[i].value;
                        const tableName = foreignKeys[i].table;
                        const exists = await model.doesResourceExist(id, tableName);

                        if (!exists) {
                            throw Boom.badData(`${foreignKeys[i].key} does not point to an existing resource`);
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
            const newRow = await model.getOne(id);

            // Set 'Location' header to the URL for the new resource
            const response = h.response(newRow).code(201);
            response.header('Location', `${request.path}/${id}`);
            return response;
        };

        // HANDLER - Update
        this.handlers.update = async function (request, h) {
            await model.update(request.params.id, request.payload);
            return h.response().code(204);
        };

        this.routes = {
            getList: {
                method: 'GET',
                path: this.basePath,
                handler: this.handlers.getList,
                options: {
                    tags: this.tags,
                    description: 'Get list',
                    validate: {
                        query: {
                            limit: model.getLimitSchema(),
                            offset: model.getOffsetSchema(),
                            sort: model.getSortSchema(),
                            reverse: model.getReverseSchema(),
                            where: model.getWhereSchema()
                        }
                    },
                    response: {
                        schema: model.getOutputArraySchema()
                    }
                }
            },

            create: {
                method: 'POST',
                path: this.basePath,
                handler: this.handlers.create,
                options: {
                    description: 'Create',
                    auth: {
                        strategy: auth.strategy,
                        scope: auth.scopes.create
                    },
                    tags: this.tags,
                    validate: {
                        payload: model.getRequiredSchema()
                    },
                    pre: [
                        this.pre.checkForeignKeysExist
                    ]
                }
            },

            getOne: {
                method: 'GET',
                path: this.basePath + '/{id}',
                handler: this.handlers.getOne,
                options: {
                    description: 'Get by ID',
                    tags: this.tags,
                    validate: {
                        params: {
                            id: model.getIdSchema()
                        }
                    },
                    response: {
                        schema: model.getOutputSchema()
                    },
                    pre: [
                        this.pre.checkResourceExists
                    ]
                }
            },

            update: {
                method: 'PATCH',
                path: this.basePath + '/{id}',
                handler: this.handlers.update,
                options: {
                    description: 'Update',
                    auth: {
                        strategy: auth.strategy,
                        scope: auth.scopes.update
                    },
                    tags: this.tags,
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
        };
    }
}

module.exports = Resource;