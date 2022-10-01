const express = require('express');
const { httpGetAllLaunches, httpCreateLaunch, httpAbortLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter
    .get('/', httpGetAllLaunches)
    .post('/', httpCreateLaunch)
    .delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;