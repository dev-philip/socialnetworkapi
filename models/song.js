const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    playlist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    songurl: {
        type: String,
        required: true
    },
    posterurl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Song", songSchema);