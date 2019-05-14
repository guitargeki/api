const Stream = require('stream');
const fetch = require('node-fetch');

module.exports = class LogToWebhookTransform extends Stream.Transform {
    /**
     * 
     * @param {string} endpoint 
     */
    constructor(endpoint) {
        super({ objectMode: true });

        this.endpoint = endpoint;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} enc 
     * @param {*} next 
     */
    _transform(data, enc, next) {
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const content = '```\n' + data + '\n```';
        options.body = JSON.stringify({
            content: content
        });
    
        fetch(this.endpoint, options);

        // The first argument passed to next() must be the Error object if the call failed or null if the write succeeded
        next(null, data);
    }
};