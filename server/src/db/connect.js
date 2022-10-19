const mongoose = require('mongoose');

const connectToDb = (uri) => {
    try {
        return mongoose.connect(uri);
    } catch (error) {
        throw error;
    }
};

const closeDbConnection = () => {
    try {
        mongoose.connection.close();
    } catch (error) {
        throw error;
    }
};

mongoose.connection.once('open', () => console.log('Connected to MongoDB!'));
mongoose.connection.on('error', (err) => console.error(err));

module.exports = {
    connectToDb,
    closeDbConnection
};