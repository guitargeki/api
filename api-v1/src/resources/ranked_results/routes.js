const path = require('path');
const Boom = require('@hapi/boom');
const Joi = require('joi');
const auth = require('../../common/routes/auth');
const Resource = require('../../common/routes/Resource');
const model = require('./model');
const resourceName = path.basename(__dirname);
const resrc = new Resource(resourceName, model);

// Handler to calculate new Elos for a single ranked result
resrc.routes.create.handler = async function (request, h) {
    const payload = request.payload;

    // Return 422 if winner and loser are the same participant
    if (payload.winner_id === payload.loser_id) {
        throw Boom.badData('Winner and loser must be different participants');
    }

    try {
        // Update Elos for both participants. Will also mark the match as Completed.
        const rankedResult = await model.submitResult(payload);

        // Set 'Location' header to the URL for the new resource
        const response = h.response(rankedResult).code(201);
        response.header('Location', `${request.path}/${rankedResult.id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Route to recalculate all Elos
const recalculateAllElos = {
    method: 'POST',
    path: resrc.basePath + '/recalculate',
    handler: async function (request, h) {
        await model.recalculateAllElos();
        return h.response().code(200);
    },
    options: {
        description: 'Recalculate all Elos',
        auth: {
            strategy: auth.strategy,
            scope: auth.scopes.update
        },
        tags: resrc.tags,
        response: {
            status: {
                204: Joi.string().empty('')
            }
        },
    }
};

module.exports = [
    resrc.routes.getList,
    resrc.routes.create,
    resrc.routes.getOne,
    recalculateAllElos
];