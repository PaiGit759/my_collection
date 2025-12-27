const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
    addcollection,
    updatecollection,
    deletecollection
} = require("../controllers/collectionController.js");

router.post(
    "/addcollection",
    upload.fields([
        { name: "foto", maxCount: 1 },
        { name: "foto1", maxCount: 1 },
        { name: "foto2", maxCount: 1 }
    ]),
    addcollection
);

router.post(
    "/updatecollection",
    upload.fields([
        { name: "foto", maxCount: 1 },
        { name: "foto1", maxCount: 1 },
        { name: "foto2", maxCount: 1 }
    ]),
    updatecollection
);

router.get("/deletecollection", deletecollection);

module.exports = router;
