const { StatusCodes } = require('http-status-codes');
const { getAllLaunches, createLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(StatusCodes.OK).json(getAllLaunches());
}

function httpCreateLaunch(req, res) {
    try {
        const launch = req.body;
        const createdLaunch = createLaunch(launch);

        return res.status(StatusCodes.OK).json(createdLaunch);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    httpGetAllLaunches,
    httpCreateLaunch
};