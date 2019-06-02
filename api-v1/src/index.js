async function init() {
    // MUST LOAD CONFIG BEFORE DOING ANYTHING ELSE
    const config = require('./common/config');
    await config.init();

    // Start server
    const server = require('./server');
    await server.start();
}

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();