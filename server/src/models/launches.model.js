const launchesDb = require('./launches.mongo');
const planetsDb = require('./planets.mongo');

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 1;

const launch = {
    flightNumber: 1,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer S1',
    launchDate: new Date('10 October, 2025'),
    target: 'MARS',
    customers: ['NASA', 'Pentagon'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

async function getAllLaunches() {
    return await launchesDb
        .find({}, { __v: 0, _id: 0 })
        .sort('-flightNumber'); // desc
}

async function getNextFlightNumber() {
    const launch = await launchesDb
        .findOne({}, 'flightNumber')
        .sort('-flightNumber');

    if (!launch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return launch.flightNumber + 1;
}

async function launchExists(launchId) {
    return await launchesDb.findOne({
        flightNumber: launchId
    });
}

async function createLaunch(launch) {
    const newFlightNumber = await getNextFlightNumber();

    const planet = await planetsDb.findOne({ keplerName: launch.target });
    if (!planet) {
        throw new Error(`Planet ${launch.target} doesn't exist.`);
    }

    const newLaunch = {
        ...launch,
        flightNumber: newFlightNumber,
        customers: ['NASA', 'Pentagon']
    };

    await saveLaunch(newLaunch);

    return newLaunch;
}

function abortLaunch(launchId) {
    const launchToAbort = launches.get(launchId);
    launchToAbort.upcoming = false;
    launchToAbort.success = false;

    return launchToAbort;
}

async function saveLaunch(launch) {
    try {
        await launchesDb.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true });
    } catch (error) {
        throw new Error('An error occured while saving launch to db.');
    }
}

module.exports = {
    getAllLaunches,
    launchExists,
    createLaunch,
    abortLaunch
};