const fetch = require('node-fetch');
const vars = {};

async function init() {
    const options = {
        headers: {
            'Authorization': process.env.CONFIGS_PASSWORD
        }
    };

    const requestedConfigs = [ 'auth', 'database', 'log' ];
    console.log('Fetching config...');

    for (const config of requestedConfigs) {
        const fetchUrl = `${process.env.CONFIGS_URL}/${config}/${process.env.APP_ENV}`;
        const response = await fetch(fetchUrl, options);
        const data = await response.json();
        vars[config] = data;
    }
}

module.exports = {
    init,
    vars
};