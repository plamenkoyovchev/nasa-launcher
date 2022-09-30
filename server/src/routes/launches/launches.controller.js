const { StatusCodes } = require('http-status-codes');
const { getAllLaunches } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(StatusCodes.OK).json(getAllLaunches());
}

module.exports = {
    httpGetAllLaunches
};