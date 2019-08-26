const basePath = '/v1';

module.exports = {
    info: {
        title: 'Guitargeki API v1',
        version: '1.0.0',
        description: 'Documentation has moved over to [https://docs.guitargeki.com](https://docs.guitargeki.com).'
    },

    basePath: basePath,
    jsonPath: `${basePath}/swagger.json`,
    swaggerUIPath: `${basePath}/swaggerui/`,
    documentationPath: `${basePath}/docs`,
    grouping: 'tags',
    tags: [],

    securityDefinitions: {
        token: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },

    security: [
        {
            token: []
        }
    ]
};