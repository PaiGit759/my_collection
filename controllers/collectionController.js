const Collection = require('../models/collectionModel.js');

const User = require('../models/userModel.js');

const createPath = require('../helpers/create-path.js');

const { getGridFSBucket } = require("./gridfs");

const addcollection = async (req, res) => {

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

        // Uploading photos
        const fotoId = await uploadToGridFS(req.files.foto?.[0]);
        const foto1Id = await uploadToGridFS(req.files.foto1?.[0]);
        const foto2Id = await uploadToGridFS(req.files.foto2?.[0]);

        // We extract data from the form
        const { title, content, cuser, group } = req.body;

        // Finding a user
        const user = await User.findById(cuser);
        if (!user) throw new Error("User not found");

        // Creating a collection
        const collection = await Collection.create({
            title,
            content,
            group,
            foto: fotoId,
            foto1: foto1Id,
            foto2: foto2Id,
            user: user._id,
            createdAt: new Date()
        });

        // We're making populate
        const populated = await Collection.findById(collection._id)
            .populate("user", "firstName lastName foto");

        // Rendering the page
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

const deletecollection = async (req, res) => {
    try {
        const title = "My collection";
        const collectionId = req.query.id;
        const page = req.query.page;

        const gridfsBucket = getGridFSBucket();
        if (!gridfsBucket) {
            return res.status(500).send("GridFS not initialized");
        }

        // Find a collection to find file IDs
        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).send("Collection not found");
        }

        // File deletion function
        const deleteFile = async (fileId) => {
            if (!fileId) return;
            try {
                await gridfsBucket.delete(fileId);
            } catch (err) {
                console.error("GRIDFS DELETE ERROR:", err);
            }
        };

        // Removing related files
        await deleteFile(collection.foto);
        await deleteFile(collection.foto1);
        await deleteFile(collection.foto2);

        // We delete the document itself
        await Collection.findByIdAndDelete(collectionId);

        res.render(createPath("index"), { title, page });

    } catch (error) {
        console.error("DELETE COLLECTION ERROR:", error);
        handleError(res, error);
    }
};


const editcollection = (req, res) => {
    const title = 'My collection';
    const collectionId = req.query.id;

    Collection
        .findById(collectionId)
        .then((collection) => res.render(createPath('edit-collection'), { collection }))
        .catch((error) => handleError(res, error));
};


const deleteFromGridFS = async (id) => {
    if (!id) return;
    const gridfsBucket = getGridFSBucket();
    try {
        await gridfsBucket.delete(id);
    } catch (err) {
        console.error("Error deleting file:", err);
    }
};


const updatecollection = async (req, res) => {
    try {
        const { collectionId, title, content, group } = req.body;

        const gridfsBucket = getGridFSBucket();
        if (!gridfsBucket) {
            return res.status(500).json({ error: "GridFS not initialized" });
        }

        const collection = await Collection.findById(collectionId);
        if (!collection) return res.status(404).send("Not found");

        const uploadToGridFS = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);

                const stream = gridfsBucket.openUploadStream(file.originalname);
                stream.end(file.buffer);

                stream.on("finish", () => resolve(stream.id));
                stream.on("error", reject);
            });
        };

        const updateFields = { title, content, group };

        // FOTO
        if (req.files.foto?.[0]) {
            await deleteFromGridFS(collection.foto);   // ← DELETE THE OLD
            updateFields.foto = await uploadToGridFS(req.files.foto[0]);
        }

        if (req.files.foto1?.[0]) {
            await deleteFromGridFS(collection.foto1);
            updateFields.foto1 = await uploadToGridFS(req.files.foto1[0]);
        }

        if (req.files.foto2?.[0]) {
            await deleteFromGridFS(collection.foto2);
            updateFields.foto2 = await uploadToGridFS(req.files.foto2[0]);
        }

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

const getgallerypage = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 18;
    const skip = (page - 1) * limit;

    // sorting
    const sortOrder = req.query.sort === 'desc' ? -1 : 1;

    // filters
    const filter = {};

    if (req.query.group) {
        filter.group = req.query.group;
    }

    if (req.query.user) {
        filter.user = req.query.user;
    }
    try {
        const items = await Collection
            .find(filter, { image: 0 })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: sortOrder });

        res.json(items);

    } catch (error) {
        handleError(res, error);
    }
};



const collection = async (req, res) => {
    const title = 'My collection';
    const collectionId = req.query.id;

    const col = await Collection.findById(collectionId).populate('user');
    Collection
        .findById(collectionId)
        .populate('user')
        .then((collection) => {
            // collection.user is now a full-fledged object
            res.render(
                createPath('collection'),
                { title, collection, userowner: collection.user } // we will transfer it separately
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
