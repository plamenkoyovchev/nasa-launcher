const { StatusCodes } = require('http-status-codes');
const { getAllLaunches, createLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(StatusCodes.OK).json(getAllLaunches());
}

function httpCreateLaunch(req, res) {
    try {
        const launch = req.body;
        const createdLaunch = createLaunch(launch);

        return res.status(StatusCodes.CREATED).json(createdLaunch);
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error occured during launch creation." });
    }
}

module.exports = {
    httpGetAllLaunches,
    httpCreateLaunch
};