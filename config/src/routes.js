const Boom = require('@hapi/boom');
const config = require('./config');

// Easy way to map environments to a different name in case the name is
// different in the remote config.
const envMappings = {
    'development': 'dev',
    'production': 'prod'
};

// Get config for specified app and environment
const getConfig = {
    method: 'GET',
    path: '/{app}/{environment}',
    handler: async function (request, h) {
        // Check if environment is valid
        const env = envMappings[request.params.environment];
        if (env === undefined) {
            return Boom.badRequest('Undefined environment.');
        }

        const data = await config.getConfig(request.params.app, env);
        return h.response(data).code(200);
    }
};

// Get the specified key from config
const getKey = {
    method: 'GET',
    path: '/{app}/{environment}/{path*}',
    handler: async function (request, h) {
        // Check if environment is valid
        const env = envMappings[request.params.environment];
        if (env === undefined) {
            return Boom.badRequest('Undefined environment.');
        }

        const data = await config.getConfig(request.params.app, env, request.params.path);
        return h.response(data).code(200);
    }
};

// Handle any invalid methods and routes
const notFound = {
    method: '*',
    path: '/{any*}',
    handler: function (request, h) {
        return Boom.notFound('The resource at the requested location could not be found');
    }
};

module.exports = [
    getConfig,
    getKey,
    notFound
];