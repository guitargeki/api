async function start() {
    // MUST LOAD CONFIG BEFORE DOING ANYTHING ELSE
    const config = require('../common/config');
    try {
        await config.init();
    } catch (error) {
        throw error;
    }

    // Set up server configuration
    const Hapi = require('hapi');
    const Boom = require('@hapi/boom');
    const Inert = require('inert');
    const Vision = require('vision');
    const HapiSwagger = require('hapi-swagger');
    const Good = require('@hapi/good');
    const jwt = require('hapi-auth-jwt2');
    const jwksRsa = require('jwks-rsa');
    const rateLimiter = require('hapi-rate-limit');
    const Logger = require('../common/logger');
    const swaggerOptions = require('../swagger');
    const routes = require('../resources');
    const codes = require('../common/routes/http-codes');

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            validate: {
                // Provide detailed validation error message
                failAction: async (request, h, err) => {
                    const validation = err.output.payload.validation;
                    err.output.payload.message = `Invalid value for '${validation.keys}' parameter`;
                    delete err.output.payload.validation;
                    throw err;
                }
            },
            cors: true
        }
    });

    // Set up rate limiting (per path per user).
    // Rates can be overridden in each routes config.
    await server.register({
        plugin: rateLimiter,
        options: {
            userLimit: false,
            pathLimit: false,
            userPathLimit: 15,
            userPathCache: {
                segment: 'hapi-rate-limit-userPath',
                expiresIn: 60000 // One minute
            },
            trustProxy: true
        }
    });

    // Add support for auth using JWTs
    await server.register(jwt);
    server.auth.strategy('jwt', 'jwt', {
        // Get the complete decoded token, because we need info from the header (the kid)
        // Omitting this will cause errors when a user sends their token!
        complete: true,

        key: async function (decoded) {
            // Manually handle any errors from jwks-rsa
            try {
                const secretProvider = jwksRsa.hapiJwt2Key({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: config.vars.auth.JWKS_URI
                });

                return new Promise(function (resolve, reject) {
                    const cb = function cb(err, key) {
                        !key || err ? resolve( { isValid: false }) : resolve({ key: key });
                    };
                    secretProvider(decoded, cb);
                });
            } catch (error) {
                return { isValid: false };
            }
        },

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
            audience: config.vars.auth.AUDIENCE,
            issuer: config.vars.auth.ISSUER,
            algorithms: ['RS256']
        },
    });

    // Register Good plugin for logging
    await server.register({
        plugin: Good,
        options: {
            ops: {
                interval: 30000
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
                    new Logger(config.vars.log.LOG_URL),
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
                    new Logger(config.vars.log.ERROR_URL)
                ]
            }
        }
    });

    // Register plugins needed to serve Swagger docs
    await server.register([
        Inert,
        Vision
    ]);

    // Serve routes and Swagger docs
    const tags = new Map();
    routes.forEach(route => {
        // Add base path to each route
        route.path = `${swaggerOptions.basePath}${route.path}`;
        server.route(route);

        // Store all tags so we can put it in the swagger file
        if (route.options.tags) {
            for (const tag of route.options.tags) {
                tags.set(tag, true);
            }
        }
    });

    for (const tag of tags.keys()) {
        if (tag !== 'api') {
            swaggerOptions.tags.push({
                name: tag
            });
        }
    }

    await server.register({ plugin: HapiSwagger, options: swaggerOptions });

    // Handle any invalid methods and routes
    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return Boom.notFound(codes[404]);
        }
    });

    // Start server
    await server.start();
    server.log([], `Server running on ${server.info.uri}`);
}

module.exports = {
    start
};