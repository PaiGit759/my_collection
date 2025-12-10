const express = require("express");
const path = require('path');

const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const createPath = require('./helpers/create-path');
const { getUsers, user, curuser, edituser } = require('./controllers/authController.js');

const { getallcollection, getgallerycount, getgallerypage, collection, editcollection, deletecollection } = require('./controllers/collectionController.js');

const User = require('./models/userModel.js');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

const authRouter = require('./routes/authRoutes.js');
const collectionRoutes = require('./routes/collectionRoutes.js');

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGO_URL,)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api', authRouter);
app.use('/api', collectionRoutes);

app.get("/", (req, res) => {
  const title = 'My collection';
  const user = null;
  res.render(createPath('index'), { title, user });
});

app.get("/getUsers", (req, res) => {
  const title = 'My collection';
});

app.get("/users", (req, res) => {
  const title = 'My collection';
});

app.get('/user', user);

app.get('/edituser', edituser);

app.get('/edituser', edituser);

app.get('/editcollection', editcollection);

app.get('/deletecollection', deletecollection);


app.get("/login", (req, res) => {
  const title = 'Login';
  const user = 'User is undefined';
  res.render(createPath('login'), { title, user });
});

app.get("/register", (req, res) => {
  const title = 'Register';
  const user = 'User is undefined';
  const message = '*********';
  res.render(createPath('register'), { message, user });
});

app.get("/addcollection", (req, res) => {
  const title = 'Collection';
  res.render(createPath('addcollection'));
});

app.get('/gallery', getallcollection);

app.get('/gallery/count', getgallerycount);

app.get('/gallerypage', getgallerypage);

app.get('/collection', collection);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening port http://localhost:${process.env.PORT}`));