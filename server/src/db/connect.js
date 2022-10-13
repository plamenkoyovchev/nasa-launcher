const mongoose = require('mongoose');

const connectToDb = (uri) => {
    try {
        return mongoose.connect(uri);
    } catch (error) {
        throw error;
    }
};

module.exports = connectToDb;