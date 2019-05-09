const Joi = require('joi');
const codes = require('../common/http-codes');
const Resource = require('../common/Resource');

// Configure
const model = require('../models/participant');
const basePath = '/participants';
const resrc = new Resource(basePath, model);

module.exports = [
    resrc.routes.getList,
    resrc.routes.create,
    resrc.routes.getOne,
    resrc.routes.update
];