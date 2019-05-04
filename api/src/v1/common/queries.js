const Joi = require('joi');

const sortAscOperator = '';
const sortDescOperator = '-';
const sortTemplate = '${operator}${column}';

/**
 * 
 */
module.exports.isValidSort = function (query, ascending = true) {
    const operator = (ascending) ? sortAscOperator : sortDescOperator;
    let regex = sortTemplate.replace('${operator}', operator);
    regex = regex.replace('${column}', '[a-zA-Z0-9_]+'); //
    regex = `^${regex}$`;

    if (query.match(regex)) {
        return true;
    }

    return false;
};

/**
 * 
 * @param {*} columnName 
 * @param {*} ascending 
 */
function getSortColumn(columnName, ascending = true) {
    const operator = (ascending) ? sortAscOperator : sortDescOperator;
    let template = sortTemplate.replace('${operator}', operator);
    template = template.replace('${column}', columnName);
    return template;
}

/**
 * 
 * @param {number} defaultValue 
 */
module.exports.limit = function (defaultValue = 10) {
    return Joi.number().integer().min(1).max(20).default(defaultValue);
};

/**
 * 
 * @param {number} defaultValue 
 */
module.exports.offset = function (defaultValue = 0) {
    return Joi.number().integer().min(0).default(defaultValue);
};

/**
 * 
 * @param {*} columnNames 
 */
module.exports.sort = function (columnNames = ['']) {
    const validColumns = [];

    // Add ascending and descending strings for ID column
    validColumns.push(getSortColumn('id'));
    validColumns.push(getSortColumn('id', false));

    // Generate ascending and descending strings for each column
    columnNames.forEach(element => {
        validColumns.push(getSortColumn(element));
        validColumns.push(getSortColumn(element, false));
    });

    return Joi.array().items(Joi.string().valid(validColumns)).unique();
};