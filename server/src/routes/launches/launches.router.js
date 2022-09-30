const express = require('express');
const { getAllLaunches } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', getAllLaunches);

module.exports = launchesRouter;