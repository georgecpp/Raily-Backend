const mongoose = require('mongoose');
const BSON = require('bson');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
        default: null
    },
    fbuserId: {
        type: String,
        required: false,
        default: null
    },
    img: {
        type: String,
        required: false,
        default: null
    },
    friends: [
        {
            _id_friend: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        }, 
        [{
            msg_sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            msg_date: {type: Date},
            msg_body: {type: String},
        }]
    ],
    historyTrains: [{_id_train: {type: mongoose.Schema.Types.ObjectId, ref: 'Train'}}],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);