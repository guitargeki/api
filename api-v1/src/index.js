async function start() {
    const server = require('./server');
    await server.start();
}

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

start();