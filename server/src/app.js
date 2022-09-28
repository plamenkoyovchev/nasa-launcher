const express = require('express');
const app = express();

const planetsRouter = require('./routes/planets/planets.router');

// middleware
app.use(express.json());

// routes
app.use('/api/v1/planets', planetsRouter);

module.exports = app;