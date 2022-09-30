const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

// middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// routes
app.use('/api/v1/planets', planetsRouter);
app.use('/api/v1/launches', launchesRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;