const { StatusCodes } = require('http-status-codes');

const { getAllPlanets } = require('../../models/planets.model');

function httpGetAllPlanets(req, res) {
    return res.status(StatusCodes.OK).json(getAllPlanets());
};

module.exports = {
    httpGetAllPlanets
};