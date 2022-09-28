const { StatusCodes } = require('http-status-codes');

const { planets } = require('../../models/planets.model');

function getAllPlanets(req, res) {
    return res.status(StatusCodes.OK).json(planets);
};

module.exports = {
    getAllPlanets
};