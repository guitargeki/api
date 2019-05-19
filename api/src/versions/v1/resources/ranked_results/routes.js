const path = require('path');
const Boom = require('@hapi/boom');
const Resource = require('../../common/routes/Resource');
const model = require('./model');
const resourceName = path.basename(__dirname);
const resrc = new Resource(resourceName, model);

// Handler to calculate new Elos

resrc.routes.create.handler = async function (request, h) {
    const payload = request.payload;

    // Return 422 if winner and loser are the same participant
    if (payload.winner_id === payload.loser_id) {
        throw Boom.badData('Winner and loser must be different participants');
    }

    try {
        // Update Elos for both participants
        const rankedResult = await model.submitResult(payload);

        // Set 'Location' header to the URL for the new resource
        const response = h.response(rankedResult).code(201);
        response.header('Location', `${request.path}/${rankedResult.id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = [
    resrc.routes.getList,
    resrc.routes.create,
    resrc.routes.getOne
];