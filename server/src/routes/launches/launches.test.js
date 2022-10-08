const { StatusCodes } = require('http-status-codes');

const request = require('supertest');
const app = require('../../app');

const httpRequester = request(app);

describe('Test launches GET: endpoint', () => {
    test('should get all launches', async () => {
        await httpRequester
            .get('/api/launches')
            .expect(StatusCodes.OK);
    });
});

describe('Test launches POST: endpoint', () => {
    test('should save new launch mission', async () => {

    });
});