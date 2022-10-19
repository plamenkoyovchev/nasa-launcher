require('dotenv').config();
const { connectToDb, closeDbConnection } = require('../../db/connect');
const { StatusCodes } = require('http-status-codes');

const request = require('supertest');
const app = require('../../app');

const httpRequester = request(app);

const url = '/api/v1/launches';

describe('Launches API', () => {
    beforeAll(async () => {
        await connectToDb(process.env.MONGO_URI);
    });

    describe('Test launches GET: endpoint', () => {
        test('should get all launches', async () => {
            await httpRequester
                .get(url)
                .expect(StatusCodes.OK);
        });
    });

    describe('Test launches POST: endpoint', () => {
        const launchData = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer S1',
            launchDate: new Date('10 October, 2025'),
            target: 'MARS',
        };

        const launchDataWithoutDate = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer S1',
            target: 'MARS',
        };

        test('should save new launch mission', async () => {
            const response = await httpRequester
                .post(url)
                .send(launchData)
                .expect(StatusCodes.CREATED);

            expect(response.body).toMatchObject(launchDataWithoutDate);

            const requestDate = new Date(launchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestDate).toEqual(responseDate);
        });

        test('should return bad request requiring missing properties', async () => {
            const response = await httpRequester
                .post(url)
                .send({
                    target: 'Sofia'
                })
                .expect(StatusCodes.BAD_REQUEST);

            expect(response.body).toStrictEqual({ error: 'Mission, launch date, target and rocket are required' });
        });

        test('should return bad request with msg that date is invalid', async () => {
            const response = await httpRequester
                .post(url)
                .send({
                    ...launchDataWithoutDate,
                    launchDate: 'dasijdsaidsjaa'
                })
                .expect(StatusCodes.BAD_REQUEST);

            expect(response.body).toStrictEqual({ error: 'Invalid launch date' });
        });
    });

    afterAll(() => {
        closeDbConnection();
    });
});