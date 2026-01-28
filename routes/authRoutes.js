const express = require('express');
const multer = require('multer');
const { register, login, getUsers, addPost, user, curuser, edituser, updateuser } = require('../controllers/authController.js');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


const router = express.Router();

router.get('/users', getUsers);

router.get('/sortingselection', async (req, res) => {
    console.log('*********')
    const users = await User.find({}, { username: 1 }).sort({ createdAt: -1 });
    res.render('sortingselection', { users });
});


router.get('/user', user);

router.get('/currentuser', curuser);

router.get('/edituser', edituser);

router.post('/login', login);
router.post('/register', upload.single('foto'), register);

router.post('/updateuser', upload.single('foto'), updateuser);

router.post('api/add-post', addPost);


module.exports = router;

