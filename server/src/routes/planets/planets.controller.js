const { StatusCodes } = require('http-status-codes');

const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
    return res.status(StatusCodes.OK).json(await getAllPlanets());
};

module.exports = {
    httpGetAllPlanets
};