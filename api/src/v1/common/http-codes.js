module.exports = {
    '200': {
        name: 'OK',
        description: 'The request completed successfully'
    },
    '201': {
        name: 'Created',
        description: 'The resource was created successfully'
    },
    '204': {
        name: 'No Content',
        description: 'The request completed successfully but did not return any content'
    },
    '400': {
        name: 'Bad Request',
        description: 'The request was formatted incorrectly. Make sure the body, path and query parameters are formatted correctly.'
    },
    '401': {
        name: 'Unauthorized',
        description: 'The Authorization header was missing or invalid'
    },
    '403': {
        name: 'Forbidden',
        description: 'The Authorization token did not have permission to access the resource'
    },
    '404': {
        name: 'Not Found',
        description: 'The resource at the requested location does not exist'
    },
    '405': {
        name: 'Method Not Allowed',
        description: 'The requested location does not accept the specified HTTP method'
    },
    '415': {
        name: 'Unsupported Media Type',
        description: 'Only \'application/json\' content types are supported'
    },
    '422': {
        name: 'Unprocessable Entity',
        description: 'The request was formatted correctly but the data was invalid'
    },
    '429': {
        name: 'Too Many Requests',
        description: 'You are being rate limited'
    },
    '500': {
        name: 'Internal Server Error',
        description: 'The request was not completed due to an internal error on the server side'
    }
};