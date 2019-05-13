const Resource = require('../../classes/Resource');
const model = require('./model');
const resrc = new Resource(model);

// Configure
const basePath = '/participants';

// Get list
const getList = {
    method: 'GET',
    path: basePath,
    handler: resrc.handlers.getList,
    options: {
        tags: ['api'],
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
};

// Create
const create = {
    method: 'POST',
    path: basePath,
    handler: resrc.handlers.create,
    options: {
        tags: ['api'],
        validate: {
            payload: model.getRequiredSchema()
        }
    }
};

// Get one
const getOne = {
    method: 'GET',
    path: basePath + '/{id}',
    handler: resrc.handlers.getOne,
    options: {
        tags: ['api'],
        validate: {
            params: {
                id: model.getIdSchema()
            }
        }
    }
};

// Update
const update = {
    method: 'PATCH',
    path: basePath + '/{id}',
    handler: resrc.handlers.update,
    options: {
        tags: ['api'],
        validate: {
            params: {
                id: model.getIdSchema()
            },
            payload: model.schema.input
        }
    }
};

module.exports = [
    getList,
    create,
    getOne,
    update
];