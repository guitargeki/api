const basePath = '/v1';

module.exports = {
    info: {
        title: 'Guitargeki API v1',
        version: '1.0.0',
        description: 'Guitargekis are competitive events where guitarists submit audio/video performances of a pre-chosen theme/song. At the end of each match or event, a panel of judges will vote for their favourite submission or rate each submission. The winner is the submission with the highest number of votes or rating.'
            + '\n\nThis is the REST API developed to archive submissions and automatically rank participants. Features an Elo rating system, authentication and authorization using JWTs, rate limiting and auto-generated Swagger/OpenAPI 2.0 documentation and specification.'
            + '\n\nAdmins: To use the **POST** and **PATCH** methods, provide a valid access token in the **Authorization** header. If you are using the endpoints directly on this page, provide a token in the **api_key** text box at the top-right of this page instead. Token must be in the form of `Bearer TOKEN`.'
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