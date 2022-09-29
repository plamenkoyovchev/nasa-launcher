const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

const planetsRouter = require('./routes/planets/planets.router');

// middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// routes
app.use('/api/v1/planets', planetsRouter);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;