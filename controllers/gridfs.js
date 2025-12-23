const mongoose = require("mongoose");

let gridfsBucket = null;

mongoose.connection.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
    });
    console.log("GridFSBucket initialized");
});

module.exports = {
    getGridFSBucket: () => gridfsBucket
};
