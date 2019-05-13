const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const logger = require('./logger');

// Set up server configuration
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            validate: {
                failAction: async (request, h, err) => {
                    console.error(err);
                    throw err;
                }
            }
        }
    });

    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: '1.0.0',
        },

        basePath: '/v1'
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    // Add routes
    server.route(require('./v1/resources'));

    // Handle any invalid methods and routes
    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return '404 Error! Page Not Found!';
        }
    });

    // Response listener
    server.events.on('response', logger.response);

    // Start server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();