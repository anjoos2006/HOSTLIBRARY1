const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    image : {
        type : String,
        required: true
    },
    author: String,
    about : String,
    date : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book',BookSchema);