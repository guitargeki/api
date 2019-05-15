const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Good = require('@hapi/good');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const Logger = require('./logger');

// Set up server configuration
const init = async function () {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    // Add support for auth using JWTs
    await server.register(jwt);
    server.auth.strategy('jwt', 'jwt', {
        // Get the complete decoded token, because we need info from the header (the kid)
        // Omitting this will cause errors when a user sends their token!
        complete: true,

        key: jwksRsa.hapiJwt2KeyAsync({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${process.env.AUTH0_TENANT}/.well-known/jwks.json`
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
            issuer: `https://${process.env.AUTH0_TENANT}/`,
            algorithms: ['RS256']
        },
    });

    // Register Good plugin for logging
    await server.register({
        plugin: Good,
        options: {
            ops: {
                interval: 10000
            },
            reporters: {
                // This reporter will log everything to the specified endpoint and to the console
                log: [
                    {
                        module: '@hapi/good-console',
                        args: [{
                            format: '',
                            color: false
                        }]
                    },
                    new Logger(process.env.LOG_URL),
                    'stdout'
                ],

                // This reporter will only log errors to the specified endpoint
                error: [
                    {
                        module: '@hapi/good-squeeze',
                        name: 'Squeeze',
                        args: [{
                            error: '*'
                        }]
                    },
                    {
                        module: '@hapi/good-console',
                        args: [{
                            format: '',
                            color: false
                        }]
                    },
                    new Logger(process.env.ERROR_URL)
                ]
            }
        }
    });

    // Register plugins needed to serve Swagger docs
    await server.register([
        Inert,
        Vision
    ]);

    // Add routes and docs for each version
    const apis = {
        v1: require('./versions/v1')
    };

    server.route(apis.v1.routes);
    await server.register({ plugin: HapiSwagger, options: apis.v1.swagger });

    // Handle any invalid methods and routes
    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return '404 Error! Page Not Found!';
        }
    });

    // Start server
    await server.start();
    server.log([], `Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();