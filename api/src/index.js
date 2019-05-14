const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const logger = require('./logger');

// Set up server configuration
const init = async function () {
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

    // Auth
    await server.register(jwt);
    server.auth.strategy('jwt', 'jwt', {
        // Get the complete decoded token, because we need info from the header (the kid)
        // Omitting this will cause errors when a user sends their token!
        complete: true,

        key: jwksRsa.hapiJwt2KeyAsync({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://guitargeki.auth0.com/.well-known/jwks.json'
        }),

        validate: async function (decoded, request) {
            return {
                isValid: true,
                credentials: {
                    // Split the scopes string because hapi-auth-jwt2 plugin expects the scope to be an array
                    scope: decoded.scope.split(' ')
                }
            };
        },

        verifyOptions: {
            audience: 'http://localhost',
            issuer: 'https://guitargeki.auth0.com/',
            algorithms: ['RS256']
        },
    });

    // Serve Swagger docs at /documentation
    const swaggerOptions = {
        info: {
            title: 'Guitargeki API',
            version: '1.0.0',
            description: 'Documentation for the Guitargeki API. To use the POST and PATCH methods, provide a valid access token in the form of \'Bearer TOKEN\'.'
        },

        basePath: '/v1',
        grouping: 'tags',
        documentationPath: '/v1/docs',

        securityDefinitions: {
            token: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        },

        security: [
            {
                token: []
            }
        ]
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