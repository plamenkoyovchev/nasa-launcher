const { StatusCodes } = require('http-status-codes');
const { getAllLaunches, launchExists, createLaunch, abortLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(StatusCodes.OK).json(getAllLaunches());
}

function httpCreateLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.launchDate || !launch.target || !launch.rocket) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Mission, launch date, target and rocket are required'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (launch.launchDate.toString() === 'Invalid Date') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Invalid launch date'
        });
    }

    try {
        const createdLaunch = createLaunch(launch);
        return res.status(StatusCodes.CREATED).json(createdLaunch);
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error occured during launch creation." });
    }
}

function httpAbortLaunch(req, res) {
    try {
        const launchId = Number(req.params.id);
        if (!launchExists(launchId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Launch does not exist." });
        }

        const abortedLaunch = abortLaunch(launchId);
        return res.status(StatusCodes.OK).json(abortLaunch);
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error occured during launch abortion." });
    }
}

module.exports = {
    httpGetAllLaunches,
    httpCreateLaunch,
    httpAbortLaunch
};