const fs = require('fs');
const path = require('path');
const swagger = require('../swagger');
module.exports = [];

// Add all subroutes
fs.readdirSync(__dirname).forEach(file => {
    // Skip the current file
    if (file == path.basename(__filename)) {
        return;
    }

    let modulePath = `./${file}`;
    const routes = require(modulePath).routes;

    // Add version to route
    routes.forEach(element => {
        element.path = `${swagger.basePath}${element.path}`;
        module.exports.push(element);
    });
});