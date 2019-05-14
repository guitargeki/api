const auth = require('../../common/auth');
const Resource = require('../../classes/Resource');
const model = require('./model');
const resrc = new Resource(model);

// Configure
const resourceName = 'matches';
const basePath = `/${resourceName}`;
const tags = ['api', resourceName];

// Get list
const getList = {
    method: 'GET',
    path: basePath,
    handler: resrc.handlers.getList,
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
};

// Create
const create = {
    method: 'POST',
    path: basePath,
    handler: resrc.handlers.create,
    options: {
        auth: {
            strategy: auth.strategy,
            scope: auth.scopes.admin
        },
        tags: tags,
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
        tags: tags,
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
        }
    }
};

module.exports = [
    getList,
    create,
    getOne,
    update
];