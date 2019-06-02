const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Set up server configuration
const startServer = async function () {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    // Add routes
    routes.forEach(route => {
        server.route(route);
    });

    // Start server
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

async function init() {
    await startServer();
}

try {
    init();
} catch (error) {
    throw Error('Could not start server.');
}