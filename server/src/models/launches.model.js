const axios = require('axios');

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

async function abortLaunch(launchId) {
    const aborted = await launchesDb.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return aborted.modifiedCount === 1;
}

async function saveLaunch(launch) {
    try {
        await launchesDb.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true });
    } catch (error) {
        throw new Error('An error occured while saving launch to db.');
    }
}

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';
async function loadLaunchesHistory() {
    const { data: { docs: launchesHistory } } = await axios.post(SPACE_X_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    const launchesHistoryForInsert = launchesHistory.map((launchDoc) => {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => payload.customers);

        return {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers
        };
    });
}

async function clearAllLaunches() {
    try {
        await launchesDb.deleteMany({});
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getAllLaunches,
    launchExists,
    createLaunch,
    abortLaunch,
    loadLaunchesHistory,
    clearAllLaunches
};