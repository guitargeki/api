const _ = require('lodash');
const fetch = require('node-fetch');
const token = require('./token');
const serviceAccount = require('../service-account.json');
const basePath = `https://${serviceAccount.project_id}.firebaseio.com/configs`;

/**
 * 
 */
async function getFetchOptions() {
    const t = await token.getAccessToken();
    const options = {
        headers: {
            'Authorization': `${t.token_type} ${t.access_token}`
        }
    };
    return options;
}

/**
 * 
 * @param {*} appName 
 * @param {*} environment
 */
async function getConfig(appName, environment, path = '') {
    // Add preceding slash if path is specified
    let keyPath = '';
    if (path !== '') {
        keyPath = '/' + keyPath;
    }

    const options = await getFetchOptions();

    // Highest to lowest priority
    const priority = [
        `${basePath}/${appName}/${environment}`,
        `${basePath}/${appName}/common`,
        `${basePath}/common/${environment}`,
        `${basePath}/common/common`
    ];

    // Get all configs and perform a deep merge so that the highest priority
    // variables override the lower priority variables
    let returnData = {};
    for (const baseUrl of priority) {
        const fetchUrl = baseUrl + keyPath + '.json';
        const response = await fetch(fetchUrl, options);
        const data = await response.json();
        returnData = _.merge(data, returnData);
    }

    if (keyPath !== '') {
        const value = _.get(returnData, path.replace(/\//g, '.'));
        return value;
    }

    return returnData;
}

module.exports = {
    getConfig
};