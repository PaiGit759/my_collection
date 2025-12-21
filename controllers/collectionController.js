const Collection = require('../models/collectionModel.js');

const User = require('../models/userModel.js');

const createPath = require('../helpers/create-path.js');

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


const addcollection = (req, res) => {
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

const updatecollection = async (req, res) => {

    const { collectionId, title, content, userId } = req.body;

    //   console.log('$$$$$$$$$', userId);

    const base64Files = {};

    ['foto', 'foto1', 'foto2'].forEach(field => {
        if (req.files[field]) {
            const fileBuffer = req.files[field][0].buffer;
            const base64String = fileBuffer.toString('base64');
            base64Files[field] = base64String;
        }
    });

    const { foto, foto1, foto2 } = base64Files;

    const updateFields = {
        title,
        content,
        ...(foto && { foto }),
        ...(foto1 && { foto1 }),
        ...(foto2 && { foto2 }),
    };

    Collection
        .findByIdAndUpdate(collectionId,
            updateFields,
            { new: true }
        )
        // .then((collection) => res.render(createPath('collection'), { collection }))

        /*     .then((collection) => res.render(createPath('collection'), {
                title: 'My collection',
                collection: populated,
                userowner: populated.user || null
            })) */


        .then(async (collection) => {
            const populated = await collection.populate('user'); res.render(createPath('collection'),
                { title: 'My collection', collection: populated, userowner: populated.user || null });
        })


        .catch((error) => res.render(createPath('error')));
};


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
    Collection
        .find({})
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
