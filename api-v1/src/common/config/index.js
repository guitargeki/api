const fetch = require('node-fetch');

async function init() {
    const response = await fetch(`http://config:3000/api-v1/${process.env.APP_ENV}`);
    const data = await response.json();
    module.exports.vars = data;
}

module.exports = {
    init
};