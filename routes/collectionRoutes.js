const express = require('express');
const multer = require('multer');
const { addcollection, getallcollection, getgallerycount, getgallerypage, collection, editcollection, updatecollection, deletecollection } = require('../controllers/collectionController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// router.post('/addcollection', upload.fields([
//     { name: 'foto', maxCount: 1 },
//     { name: 'foto1', maxCount: 1 },
//     { name: 'foto2', maxCount: 1 }
// ]), addcollection);


router.post("/addcollection", upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "foto1", maxCount: 1 },
    { name: "foto2", maxCount: 1 }
]), addcollection);


router.post('/updatecollection', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'foto1', maxCount: 1 },
    { name: 'foto2', maxCount: 1 }
]), updatecollection);

router.get('/editcollection', editcollection);

router.get('/gallery', getallcollection);

router.get('/gallery/count', getgallerycount);

router.get('/gallerypage', getgallerypage);

router.get('/collection', collection);

module.exports = router;

