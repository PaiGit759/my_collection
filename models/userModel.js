const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    /*    foto: {
           type: String,
           default: null,
       }, */

    foto: { type: mongoose.Schema.Types.ObjectId, default: null, },

    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: 'user',
    },
});


const User = mongoose.model('User', userSchema);

module.exports = User;