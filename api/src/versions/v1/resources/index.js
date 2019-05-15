const fs = require('fs');
const path = require('path');
const Resource = require('../common/routes/Resource');
module.exports = [];

// Add all subroutes
fs.readdirSync(__dirname).forEach(file => {
    // Skip the current file
    if (file == path.basename(__filename)) {
        return;
    }

    let modulePath = `./${file}`;
    const resource = require(modulePath);
    const model = resource.model;
    let routes = resource.routes;

    // If routes doesn't exist, instantiate a new Resource class to get the default routes
    let resrc;
    if (!routes) {
        resrc = new Resource(file, model);
        routes = resrc.routes;
    }

    // Export each route
    routes.forEach(route => {
        module.exports.push(route);
    });
});