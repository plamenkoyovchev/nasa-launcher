const launches = new Map();

let latestFlightNumber = 1;

const launch = {
    flightNumber: 1,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer S1',
    launchDate: new Date('10 October, 2025'),
    target: 'MARS',
    customer: ['NASA', 'Pentagon'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function launchExists(launchId) {
    return launches.has(launchId);
}

function createLaunch(launch) {
    latestFlightNumber++;

    const newLaunch = {
        ...launch,
        flightNumber: latestFlightNumber,
        customer: ['NASA', 'Pentagon'],
        upcoming: true,
        success: true
    };

    launches.set(latestFlightNumber, newLaunch);

    return newLaunch;
}

function abortLaunch(launchId) {
    const launchToAbort = launches.get(launchId);
    launchToAbort.upcoming = false;
    launchToAbort.success = false;

    return launchToAbort;
}

module.exports = {
    getAllLaunches,
    launchExists,
    createLaunch,
    abortLaunch
};