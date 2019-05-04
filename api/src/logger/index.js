const fetch = require('node-fetch');
const logWebhook = process.env.HOOK_LOG_URL;
const options = {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: ''
};

const localTimeZone = 'Australia/Sydney';
const dateLocale = 'en-AU';
const dateOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: false
};

/**
  * Returns a timestamp in the local timezone
  */
function getLocalTimestamp() {
    dateOptions.timeZone = localTimeZone;
    return new Date().toLocaleString(dateLocale, dateOptions);
}

/**
  * Returns a timestamp in the UTC timezone
  */
function getUtcTimestamp() {
    dateOptions.timeZone = undefined;
    return new Date().toLocaleString(dateLocale, dateOptions);
}

/**
 * 
 * @param {*} request 
 */
function logResponse(request) {
    // Don't log documentation requests
    if (request.path.includes('swagger') || request.path.includes('/documentation')) {
        return;
    }

    const content =`
**[${request.info.id}]**
\`\`\`
${getUtcTimestamp()} | ${getLocalTimestamp()}

Route: ${request.method.toUpperCase()} ${request.path}
\`\`\`
    `;

    options.body = JSON.stringify({
        content: content
    });

    fetch(logWebhook, options);
}

module.exports.response = logResponse;