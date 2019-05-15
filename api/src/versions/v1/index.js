const swagger = require('./swagger');
const routes = require('./resources');
module.exports.routes = [];
module.exports.swagger = swagger;

// Add base path to each route and export
routes.forEach(route => {
    route.path = `${swagger.basePath}${route.path}`;
    module.exports.routes.push(route);
});