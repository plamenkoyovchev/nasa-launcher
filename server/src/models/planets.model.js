const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planetsDb = require('./planets.mongo');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', data => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.error(err);
                reject(err);
            })
            .on('end', () => {
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planetsDb.find({});
}

async function savePlanet(planet) {
    try {
        await planetsDb.updateOne({ keplerName: planet.kepler_name }, { keplerName: planet.kepler_name }, { upsert: true });
    } catch (error) {
        console.error(error);
    }
}

async function clearAllPlanets() {
    try {
        await planetsDb.deleteMany({});
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
    clearAllPlanets
};