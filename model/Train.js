const mongoose = require('mongoose');
const BSON = require('bson');

const trainSchema = new mongoose.Schema({
    dateAvailable: {
        type: Date,
        required: true
    },
    timetable: {
        type: String,
        required: true
    },
    source_location: {
        type: String,
        required: true,
    },
    dest_location: {
        type: String,
        required: true
    },
    passangers: [{_id_user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Train', trainSchema);