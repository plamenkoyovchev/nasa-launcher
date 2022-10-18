const { StatusCodes } = require('http-status-codes');
const { getAllLaunches, launchExists, createLaunch, abortLaunch } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(StatusCodes.OK).json(await getAllLaunches());
}

async function httpCreateLaunch(req, res) {
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
        const createdLaunch = await createLaunch(launch);
        return res.status(StatusCodes.CREATED).json(createdLaunch);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
}

async function httpAbortLaunch(req, res) {
    try {
        const launchId = Number(req.params.id);
        const existingLaunch = await launchExists(launchId);
        if (existingLaunch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Launch does not exist." });
        }

        const abortedLaunch = await abortLaunch(launchId);
        if (!abortedLaunch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Unable to abort launch." });
        }

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