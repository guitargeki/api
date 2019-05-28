const fetch = require('node-fetch');

const commonGroupName = 'common';

/**
 * Check if group name is undefined or null. If it is, return the common group name.
 * Otherwise, return the original group name.
 * @param {string} groupName 
 */
function validateGroupName(groupName) {
    if (groupName === undefined || groupName === null) {
        return commonGroupName;
    }

    return groupName;
}

/**
 * 
 */
class ConfigLoader {
    constructor() {
        // Initialize the common group
        this._vars = {};
        this._vars[commonGroupName] = {};
    }

    /**
     * Get the value of a variable.
     * @param {string} variableName - Name of the variable to retrieve.
     * @param {string} groupName - The group the variable is grouped under. If groupName is not passed, undefined or null,
     * the function will retrieve a value from the common group instead.
     */
    getValue(variableName, groupName = commonGroupName) {
        const group = validateGroupName(groupName);
        return this._vars[group][variableName];
    }

    /**
     * Returns an object containing all variables of the specified group. Note that this returns a **copy** of the original object.
     * @param {string} groupName - The group to retrieve. If groupName is not passed, undefined or null,
     * the function will retrieve the common group instead.
     */
    getGroup(groupName = commonGroupName) {
        const group = validateGroupName(groupName);
        return Object.assign({}, this._vars[group]);
    }

    /**
     * Retrieve variables from the specified URL. Variables will be stored and can be retrieved
     * using the get() function.
     * @param {string} url - 
     * @param {string} token - Access token used to access the URL.
     * @param {string} groupName - The namespace to access a variable by. If not passed, undefined or null,
     * variables will be put under the common group. See the getValue or getGroup functions for more info.
     */
    async load(url, token, groupName = commonGroupName) {
        try {
            const options = {
                headers: {
                    'Private-Token': token
                }
            };

            // If status code isn't 200, something went wrong
            let response = await fetch(url, options);
            if (response.status !== 200) {
                throw Error('Unexpected error trying to retrieve external config variables.');
            }

            // If groupName is not specified, put variables into a common child object (the common group).
            // Else, store variables in a child object with the specified groupName.
            const group = validateGroupName(groupName);
            if (this._vars[group] === undefined) {
                this._vars[group] = {};
            }

            const payload = await response.json();
            for (const variable of payload) {
                this._vars[group][variable.key] = variable.value;
            }

        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = ConfigLoader;