const fetch = require('node-fetch');

async function init() {
    const options = {
        headers: {
            'Authorization': process.env.CONFIGS_PASSWORD
        }
    };

    const requestedConfigs = [ 'auth0', 'database', 'log' ];

    for (const config of requestedConfigs) {
        const fetchUrl = `${process.env.CONFIGS_URL}/${config}/${process.env.APP_ENV}`;
        const response = await fetch(fetchUrl, options);
        const data = await response.json();
        module.exports.vars[config] = data;
    }
}

module.exports = {
    init
};