const launches = new Map();

const launch = {
    flightNumber: 1,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer S1',
    launchDate: new Date('10 October, 2025'),
    destination: 'MARS',
    customer: ['NASA', 'Pentagon'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

module.exports = {
    launches
};