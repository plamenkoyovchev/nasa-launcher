const express = require('express');

const planetsRouter = require('../planets/planets.router');
const launchesRouter = require('../launches/launches.router');

const apiRouterV1 = express.Router();

apiRouterV1.use('/planets', planetsRouter);
apiRouterV1.use('/launches', launchesRouter);

module.exports = apiRouterV1;
