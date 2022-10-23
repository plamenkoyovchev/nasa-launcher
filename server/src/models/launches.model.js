const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const launchesDb = require('./launches.mongo');
const planetsDb = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 1;

async function getAllLaunches(skip, limit, showHistory) {
    const filter = showHistory ? { upcoming: false } : {};

    return await launchesDb
        .find(filter, { __v: 0, _id: 0 })
        .skip(skip)
        .limit(limit);
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

async function loadLaunchesHistory() {

    const launchExists = await launchesDb.findOne({ flightNumber: 1 });
    if (launchExists) {
        return;
    }

    const history = await fetchLaunchesHistory();

    await launchesDb.insertMany(history, (error) => console.error(error));
}

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';
async function fetchLaunchesHistory() {
    const response = await axios.post(SPACE_X_API_URL, {
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

    if (response.statusCode !== StatusCodes.OK) {
        console.error('Unable to download launches historycal data!');
        return [];
    }

    return response.data.docs.map((launchDoc) => {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => payload.customers);

        return {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc.upcoming ?? false,
            success: launchDoc.success ?? false,
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