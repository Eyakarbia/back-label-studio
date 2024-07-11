const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    age: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);
