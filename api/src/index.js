const Hapi = require('hapi');

// Set up server configuration
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    // Add routes
    server.route(require('./v1/routes'));

    // Handle any invalid methods and routes
    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {

            return '404 Error! Page Not Found!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();