const fetch = require('node-fetch');

async function init() {
    const options = {
        headers: {
            'Authorization': process.env.CONFIGS_PASSWORD
        }
    };

    const fetchUrl = `${process.env.CONFIGS_URL}/api-v1/${process.env.APP_ENV}`;
    const response = await fetch(fetchUrl, options);
    const data = await response.json();
    module.exports.vars = data;
}

module.exports = {
    init
};