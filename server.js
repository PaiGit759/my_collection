// const express = require("express");
// const path = require('path');

// const bodyParser = require("body-parser");
// const mongoose = require('mongoose');

// const createPath = require('./helpers/create-path');
// const { getUsers, user, curuser, edituser } = require('./controllers/authController.js');

// const { getallcollection, getgallerycount, getgallerypage, collection, editcollection, deletecollection } = require('./controllers/collectionController.js');

// const User = require('./models/userModel.js');

// require('dotenv').config();

// const app = express();

// app.set('view engine', 'ejs');

// const authRouter = require('./routes/authRoutes.js');
// const collectionRoutes = require('./routes/collectionRoutes.js');

// app.use(bodyParser.json());

// app.use(express.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, 'public')));

// app.set('views', path.join(__dirname, 'views'));

// mongoose.connect(process.env.MONGO_URL,)
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('MongoDB connection error:', err));


// app.use('/api', authRouter);
// app.use('/api', collectionRoutes);

// app.get("/", (req, res) => {
//   const title = 'My collection';
//   const user = null;
//   res.render(createPath('index'), { title, user });
// });

// app.get("/getUsers", (req, res) => {
//   const title = 'My collection';
// });

// app.get("/users", (req, res) => {
//   const title = 'My collection';
// });

// app.get('/user', user);

// //app.get('/edituser', edituser);

// app.get('/edituser', edituser);

// app.get('/editcollection', editcollection);

// app.get('/deletecollection', deletecollection);


// app.get("/login", (req, res) => {
//   const title = 'Login';
//   const user = 'User is undefined';
//   res.render(createPath('login'), { title, user });
// });

// app.get("/register", (req, res) => {
//   const title = 'Register';
//   const user = 'User is undefined';
//   const message = '*********';
//   res.render(createPath('register'), { message, user });
// });

// app.get("/addcollection", (req, res) => {
//   const title = 'Collection';
//   res.render(createPath('addcollection'));
// });

// app.get("/about", (req, res) => {
//   const title = 'About';
//   res.render(createPath('about'));
// });

// app.get('/gallery', getallcollection);

// app.get('/gallery/count', getgallerycount);

// app.get('/gallerypage', getgallerypage);

// app.get('/collection', collection);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`listening port http://localhost:${process.env.PORT}`));

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

//app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

/* let gridfsBucket; mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db,
    { bucketName: "uploads" }); console.log("GridFSBucket initialized");
});

module.exports = { gridfsBucket }; */

//const { getGridFSBucket } = require("/Users/pai/Documents/web-projects/FullStack/NODE/my_collection/controllers/gridfs.js");


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

//const mongoose = require("mongoose");
//const { getGridFSBucket } = require("./gridfs");

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



app.get("/about", (req, res) => {
  res.render(createPath('about'), { title: 'About' });
});

app.get('/gallery', getallcollection);
app.get('/gallery/count', getgallerycount);
app.get('/gallerypage', getgallerypage);
app.get('/collection', collection);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
