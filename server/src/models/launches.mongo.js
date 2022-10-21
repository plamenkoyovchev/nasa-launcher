const mongoose = require('mongoose');

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: [true, 'flight number is required'],
        min: 1
    },
    mission: {
        type: String,
        required: [true, 'mission is required']
    },
    rocket: {
        type: String,
        required: [true, 'rocket is required']
    },
    launchDate: {
        type: Date,
        required: [true, 'launch date is required'],
        default: Date.now
    },
    target: {
        type: String
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('Launches', launchSchema);