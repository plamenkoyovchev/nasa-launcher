const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: [true, 'kepler name is required']
    }
});

module.exports = mongoose.model('Planets', planetSchema);