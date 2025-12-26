const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
    },

    /*    foto: {
           type: String,
           default: null,
       },
   
       foto1: {
           type: String,
           default: null,
       },
       foto2: {
           type: String,
           default: null,
       },
    */

    foto: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },

    foto1: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },

    foto2: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },


    content: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },


});


const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;