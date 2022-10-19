require('dotenv').config();

const http = require('http');
const { connectToDb } = require('./db/connect');
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 5555;

const server = http.createServer(app);

async function startServer() {
    try {
        await connectToDb(process.env.MONGO_URI);
        await loadPlanetsData();

        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

startServer();