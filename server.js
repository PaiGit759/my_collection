const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const createPath = require('./helpers/create-path');
const { getUsers, user, curuser, edituser } = require('./controllers/authController.js');
const { getallcollection, getgallerycount, getgallerypage, collection, editcollection, deletecollection } = require('./controllers/collectionController.js');

const authRouter = require('./routes/authRoutes.js');
const collectionRoutes = require('./routes/collectionRoutes.js');

const { getGridFSBucket } = require("./controllers/gridfs.js");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRouter);
app.use('/api', collectionRoutes);

app.get("/", (req, res) => {
  res.render(createPath('index'), { title: 'My collection', user: null });
});

app.get('/user', user);
app.get('/edituser', edituser);
app.get('/editcollection', editcollection);
app.get('/deletecollection', deletecollection);

app.get("/login", (req, res) => {
  res.render(createPath('login'), { title: 'Login', user: null });
});

app.get("/register", (req, res) => {
  res.render(createPath('register'), { title: 'Register', user: null, message: '*********' });
});

app.get("/addcollection", (req, res) => {
  res.render(createPath('addcollection'), { title: 'Collection' });
});

app.get("/image/:id", (req, res) => {
  const gridfsBucket = getGridFSBucket();
  if (!gridfsBucket) return res.status(500).send("GridFS not ready");

  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    return res.status(400).send("Invalid ID");
  }

  gridfsBucket
    .openDownloadStream(id)
    .on("error", () => res.status(404).send("File not found"))
    .pipe(res);
});

app.get("/user/foto/:id", (req, res) => {
  const gridfsBucket = getGridFSBucket();
  if (!gridfsBucket) return res.status(500).send("GridFS not ready");

  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    return res.status(400).send("Invalid ID");
  }

  gridfsBucket
    .openDownloadStream(id)
    .on("error", () => res.status(404).send("File not found"))
    .pipe(res);
});


app.get("/about", (req, res) => {
  res.render(createPath('about'), { title: 'About' });
});

app.get("/sorting_selection", (req, res) => {
  res.render(createPath('sorting_selection'), { title: 'Sorting and selection' });
});

app.get('/gallery', getallcollection);
app.get('/gallery/count', getgallerycount);
app.get('/gallerypage', getgallerypage);
app.get('/collection', collection);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
