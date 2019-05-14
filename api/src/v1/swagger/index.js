module.exports = {
    info: {
        title: 'Guitargeki API',
        version: '1.0.0',
        description: 'Documentation for the Guitargeki API. To use the POST and PATCH methods, provide a valid access token in the form of \'Bearer TOKEN\'.'
    },

    basePath: '/v1',
    grouping: 'tags',
    documentationPath: '/v1/docs',

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