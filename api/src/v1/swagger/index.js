const basePath = '/v1';

module.exports = {
    info: {
        title: 'Guitargeki API V1',
        version: '1.0.0',
        description: 'Documentation for the Guitargeki API. To use the POST and PATCH methods, provide a valid access token in the form of \'Bearer TOKEN\'.'
    },

    basePath: basePath,
    jsonPath: `${basePath}/swagger.json`,
    documentationPath: `${basePath}/docs`,
    grouping: 'tags',

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