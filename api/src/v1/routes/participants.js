const Joi = require('joi');
const util = require('../common/utilities');
const queries = require('../common/queries');
const codes = require('../common/http-codes');

// Configure
const model = require('../models/participant');
const basePath = '/participants';
const schema = {
    username: Joi.string().regex(/^[a-zA-Z0-9 _-]+$/).min(2).max(32),
    avatar_url: Joi.string().uri().max(200),
    is_team: Joi.boolean(),
    global_elo: Joi.number().min(-1).max(10000)
};

// Get list
const getList = {
    method: 'GET',
    path: basePath,

    handler: async function (request, h) {
        const data = await model.getList(request.query);
        return h.response(data).code(200);
    },

    options: {
        description: 'Retrieve a list of participants',
        tags: ['api'],
        validate: {
            query: {
                limit: queries.limit(),
                offset: queries.offset(),
                sort: queries.sort(Object.keys(schema)),
                reverse: queries.reverse()
            }
        }
    }
};

// Create
const create = {
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
        description: 'Create a new participant',
        tags: ['api'],
        validate: {
            payload: util.getRequiredSchema(schema)
        }
    }
};

// Get one
const getOne = {
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
        description: 'Retrieve a participant by ID',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.number().integer().required()
            }
        }
    }
};

// Update
const update = {
    method: 'PATCH',
    path: basePath + '/{id}',

    handler: async function (request, h) {
        // Return 404 if resource does not exist
        const data = await model.getOne(request.params.id);
        if (data === undefined) {
            return h.response(codes[404]).code(404);
        }

        // Update the requested fields
        for (const key in request.payload) {
            data[key] = request.payload[key];
        }

        await model.update(data);
        return h.response().code(204);
    },

    options: {
        description: 'Update a participant by ID',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.number().integer().required()
            },
            payload: schema
        }
    }
};

module.exports = [
    getList,
    create,
    getOne,
    update
];