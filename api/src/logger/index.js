const Stream = require('stream');
const fetch = require('node-fetch');
const logWebhook = process.env.HOOK_LOG_URL;
const options = {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: ''
};

module.exports = class LogToWebhookTransform extends Stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(data, enc, next) {
        const content = `
\`\`\`
${data}
\`\`\`
        `;

        options.body = JSON.stringify({
            content: content
        });
    
        fetch(logWebhook, options);

        // The first argument passed to next() must be the Error object if the call failed or null if the write succeeded
        next(null, data);
    }
};