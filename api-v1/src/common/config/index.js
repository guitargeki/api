const fetch = require('node-fetch');

async function init() {
    const response = await fetch(`http://config/api-v1/${process.env.APP_ENV}`);
    const data = await response.json();
    console.log(data);
    module.exports.vars = data;
}

module.exports = {
    init
};