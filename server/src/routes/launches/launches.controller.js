const { StatusCodes } = require('http-status-codes');
const { launches } = require('../../models/launches.model');

function getAllLaunches(req, res) {
    return res.status(StatusCodes.OK).json(Array.from(launches.values()));
}

module.exports = {
    getAllLaunches
};