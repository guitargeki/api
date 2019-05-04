const fs = require('fs');
const path = require('path');
const version = 'v1';
module.exports = [];

// Add all subroutes
fs.readdirSync(__dirname).forEach(file => {
    // Skip the current file
    if (file == path.basename(__filename)) {
        return;
    }

    let modulePath = `./${file}`;
    const routes = require(modulePath);

    // Add version to route
    routes.forEach(element => {
        element.path = `/${version}${element.path}`;
        module.exports.push(element);
    });
});