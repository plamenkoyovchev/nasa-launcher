const express = require('express');
const cors = require('cors');
const app = express();

const planetsRouter = require('./routes/planets/planets.router');

// middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// routes
app.use('/api/v1/planets', planetsRouter);

module.exports = app;