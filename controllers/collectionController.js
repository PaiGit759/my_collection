const Collection = require('../models/collectionModel.js');

const User = require('../models/userModel.js');

const createPath = require('../helpers/create-path.js');

//const { gridfsBucket } = require("../server"); // путь подправь под свой проект

//const { gridfsBucket } = require('../server.js');

const { getGridFSBucket } = require("./gridfs");


//const Collection = require("../models/Collection");

// const addcollection = async (req, res) => {
//     const base64Files = {};

//     ['foto', 'foto1', 'foto2'].forEach(field => {
//         if (req.files[field]) {
//             const fileBuffer = req.files[field][0].buffer;
//             const base64String = fileBuffer.toString('base64');
//             base64Files[field] = base64String;
//         }
//     });
//     const { title, content, cuser } = req.body;

//     // Найти пользователя по ID
//     const user = await User.findById(cuser);
//     if (!user) {
//         return res.status(404).send('User not found');
//     }

//     const collection = new Collection({
//         title,
//         content,
//         foto: base64Files.foto || "",
//         foto1: base64Files.foto1 || "",
//         foto2: base64Files.foto2 || "",
//         user: user._id // Привязка пользователя
//     });
//     //    console.log('55555');


//     await savedCollection.populate('user');

//     collection
//         .save()
//         //       .populate('user')
//         //       .then((collection) => res.render(createPath('collection'), { collection }))
//         .then((collection) => {
//             // теперь collection.user — полноценный объект
//             res.render(
//                 createPath('collection'),
//                 { title, collection, userowner: savedCollection.user } // передаём отдельно
//             );
//         })
//         .catch(() => res.render(createPath('error')));

// }


/* const addcollection = (req, res) => {
    const base64Files = {};
    ['foto', 'foto1', 'foto2'].forEach(field => {
        if (req.files[field]) {
            const fileBuffer = req.files[field][0].buffer;
            base64Files[field] = fileBuffer.toString('base64');
        }
    });

    const { title, content, cuser } = req.body;

    User.findById(cuser)
        .then(user => {
            if (!user) throw new Error('User not found');

            const collection = new Collection({
                title,
                content,
                foto: base64Files.foto || "",
                foto1: base64Files.foto1 || "",
                foto2: base64Files.foto2 || "",
                user: user._id
            });

            return collection.save();
        })
        .then(saved => {
            return Collection.findById(saved._id)
                .populate({ path: 'user', select: 'firstName lastName foto' });
        })
        .then(populated => {
            res.render(
                createPath('collection'),
                {
                    title: 'My collection',
                    collection: populated,
                    userowner: populated.user || null
                }
            );
        })
        //   .catch(error => handleError(res, error));
        .catch(() => res.render(createPath('error')));

};
 */


/* const addcollection = async (req, res) => {
    try {
        const base64Files = {};

        ['foto', 'foto1', 'foto2'].forEach(field => {
            if (req.files?.[field]?.[0]) {
                base64Files[field] = req.files[field][0].buffer.toString('base64');
            }
        });

        const { title, content, cuser } = req.body;

        const user = await User.findById(cuser);
        if (!user) throw new Error('User not found');

        const collection = await Collection.create({
            title,
            content,
            foto: base64Files.foto || "",
            foto1: base64Files.foto1 || "",
            foto2: base64Files.foto2 || "",
            user: user._id
        });

        const populated = await Collection.findById(collection._id)
            .populate('user', 'firstName lastName foto');

        res.render(createPath('collection'), {
            title: 'My collection',
            collection: populated,
            userowner: populated.user || null
        });

    } catch (err) {
        console.error('ADD COLLECTION ERROR:', err);
        res.render(createPath('error'));
    }
};

 */



/* const addcollection = async (req, res) => {
    try {
        const gridfsBucket = getGridFSBucket();
        if (!gridfsBucket) {
            return res.status(500).json({ error: "GridFS not initialized yet" });
        }

        const uploadToGridFS = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);

                const stream = gridfsBucket.openUploadStream(file.originalname);
                stream.end(file.buffer);

                stream.on("finish", () => resolve(stream.id));
                stream.on("error", reject);
            });
        };

        const fotoId = await uploadToGridFS(req.files.foto?.[0]);
        const foto1Id = await uploadToGridFS(req.files.foto1?.[0]);
        const foto2Id = await uploadToGridFS(req.files.foto2?.[0]);

        const item = new Collection({
            title: req.body.title,
            description: req.body.description,
            foto: fotoId,
            foto1: foto1Id,
            foto2: foto2Id,
            createdAt: new Date()
        });

        await item.save();

        res.json({ success: true, item });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
};
 */

const addcollection = async (req, res) => {

    console.log("GRIDFS VERSION RUNNING");

    try {
        const gridfsBucket = getGridFSBucket();
        if (!gridfsBucket) {
            return res.status(500).send("GridFS not initialized yet");
        }

        const uploadToGridFS = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);

                const stream = gridfsBucket.openUploadStream(file.originalname);
                stream.end(file.buffer);

                stream.on("finish", () => resolve(stream.id));
                stream.on("error", reject);
            });
        };

        // Загружаем фото
        const fotoId = await uploadToGridFS(req.files.foto?.[0]);
        const foto1Id = await uploadToGridFS(req.files.foto1?.[0]);
        const foto2Id = await uploadToGridFS(req.files.foto2?.[0]);

        // Достаём данные из формы
        const { title, content, cuser } = req.body;

        // Находим пользователя
        const user = await User.findById(cuser);
        if (!user) throw new Error("User not found");

        // Создаём коллекцию
        const collection = await Collection.create({
            title,
            content,
            foto: fotoId,
            foto1: foto1Id,
            foto2: foto2Id,
            user: user._id,
            createdAt: new Date()
        });

        // Делаем populate
        const populated = await Collection.findById(collection._id)
            .populate("user", "firstName lastName foto");

        // Рендерим страницу
        res.render(createPath("collection"), {
            title: "My collection",
            collection: populated,
            userowner: populated.user || null
        });

    } catch (err) {
        console.error("ADD COLLECTION ERROR:", err);
        res.render(createPath("error"));
    }
};


const deletecollection = (req, res) => {
    const title = 'My collection';
    const collectionId = req.query.id;
    const page = req.query.page;
    //    console.log('%%%%%%%%%', page);
    Collection
        .findByIdAndDelete(collectionId)
        .then((collection) => res.render(createPath('index'), { title, page }))
        .catch((error) => handleError(res, error));
};

const editcollection = (req, res) => {
    const title = 'My collection';
    const collectionId = req.query.id;

    Collection
        .findById(collectionId)
        .then((collection) => res.render(createPath('edit-collection'), { collection }))
        .catch((error) => handleError(res, error));
};

// const updatecollection = async (req, res) => {

//     const { collectionId, title, content, userId } = req.body;

//     //   console.log('$$$$$$$$$', userId);

//     const base64Files = {};

//     ['foto', 'foto1', 'foto2'].forEach(field => {
//         if (req.files[field]) {
//             const fileBuffer = req.files[field][0].buffer;
//             const base64String = fileBuffer.toString('base64');
//             base64Files[field] = base64String;
//         }
//     });

//     const { foto, foto1, foto2 } = base64Files;

//     const updateFields = {
//         title,
//         content,
//         ...(foto && { foto }),
//         ...(foto1 && { foto1 }),
//         ...(foto2 && { foto2 }),
//     };

//     Collection
//         .findByIdAndUpdate(collectionId,
//             updateFields,
//             { new: true }
//         )
//         // .then((collection) => res.render(createPath('collection'), { collection }))

//         /*     .then((collection) => res.render(createPath('collection'), {
//                 title: 'My collection',
//                 collection: populated,
//                 userowner: populated.user || null
//             })) */


//         .then(async (collection) => {
//             const populated = await collection.populate('user'); res.render(createPath('collection'),
//                 { title: 'My collection', collection: populated, userowner: populated.user || null });
//         })


//         .catch((error) => res.render(createPath('error')));
// };


///const { getGridFSBucket } = require("../gridfs");
//const mongoose = require("mongoose");
//const Collection = require("../models/collectionModel");

const updatecollection = async (req, res) => {
    try {
        const { collectionId, title, content } = req.body;

        const gridfsBucket = getGridFSBucket();
        if (!gridfsBucket) {
            return res.status(500).json({ error: "GridFS not initialized" });
        }

        // Загружаем файл в GridFS
        const uploadToGridFS = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);

                const stream = gridfsBucket.openUploadStream(file.originalname);
                stream.end(file.buffer);

                stream.on("finish", () => resolve(stream.id));
                stream.on("error", reject);
            });
        };

        // Загружаем новые файлы (если есть)
        const fotoId = await uploadToGridFS(req.files.foto?.[0]);
        const foto1Id = await uploadToGridFS(req.files.foto1?.[0]);
        const foto2Id = await uploadToGridFS(req.files.foto2?.[0]);

        // Формируем объект обновления
        const updateFields = {
            title,
            content,
        };

        if (fotoId) updateFields.foto = fotoId;
        if (foto1Id) updateFields.foto1 = foto1Id;
        if (foto2Id) updateFields.foto2 = foto2Id;

        // Обновляем документ
        const updated = await Collection.findByIdAndUpdate(
            collectionId,
            updateFields,
            { new: true }
        ).populate("user");

        res.render(createPath("collection"), {
            title: "My collection",
            collection: updated,
            userowner: updated.user || null
        });

    } catch (err) {
        console.error(err);
        res.render(createPath("error"));
    }
};

//module.exports = { updatecollection };


const getallcollection = (req, res) => {
    const title = 'My collection';
    Collection
        .find({})
        .sort({ createdAt: -1 })
        .then((collection) => res.json(collection))
        .catch((error) => handleError(res, error));
};

const getgallerycount = (req, res) => {
    Collection
        .countDocuments({})
        .then((count) => res.json({ count }))
        .catch((error) => handleError(res, error));
};


const getgallerypage = (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 18;
    const skip = (page - 1) * limit;

    //  console.log('£££££££££', page, limit, skip);

    Collection
        //    .find({})//{}, { image: 0 }
        .find({}, { image: 0 })
        .skip(skip)
        .limit(limit)
        //.sort({ createdAt: -1 })
        .sort({ createdAt: 1 })
        .then((items) => res.json(items))
        .catch((error) => handleError(res, error));
};

const collection = async (req, res) => {
    const title = 'My collection';
    const collectionId = req.query.id;

    const col = await Collection.findById(collectionId).populate('user');
    // console.log(col.user);

    Collection
        .findById(collectionId)
        .populate('user')
        //.then((collection) => res.render(createPath('collection'), { collection }))
        .then((collection) => {
            // теперь collection.user — полноценный объект
            res.render(
                createPath('collection'),
                { title, collection, userowner: collection.user } // передаём отдельно
            );
        })
        .catch((error) => handleError(res, error));
};

module.exports = {
    addcollection,
    getallcollection,
    getgallerycount,
    getgallerypage,
    collection,
    editcollection,
    updatecollection,
    deletecollection,
};
