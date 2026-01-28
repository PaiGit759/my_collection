const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');

const createPath = require('../helpers/create-path.js');

const fs = require('fs');

const { getGridFSBucket } = require("./gridfs");

const handleError = (res, error) => {
    res.status(500).send(error.message);
}

async function readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
    });
    return result_base64;
}

const deleteFromGridFS = async (id) => {
    if (!id) return;
    const bucket = getGridFSBucket();
    try {
        await bucket.delete(id);
    } catch (err) {
        console.error("Error deleting file:", err);
    }
};

const uploadToGridFS = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);

        const bucket = getGridFSBucket();
        const stream = bucket.openUploadStream(file.originalname);
        stream.end(file.buffer);

        stream.on("finish", () => resolve(stream.id));
        stream.on("error", reject);
    });
};

const register = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password: pass, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.render(createPath("register"), { message: "User with this email already exists" });
        }

        const fotoId = await uploadToGridFS(req.file);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password: hash,
            role,
            foto: fotoId
        });

        await user.save();

        res.render(createPath("user"), { user });

    } catch (err) {
        console.error(err);
        res.render(createPath("error"));
    }
};

const updateuser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password: pass, role } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.render(createPath("error"));

        const updateFields = {
            username,
            firstName,
            lastName,
            email,
            role
        };

        // If a new file arrives, delete the old one and upload the new one.
        if (req.file) {
            await deleteFromGridFS(user.foto);
            updateFields.foto = await uploadToGridFS(req.file);
        }

        // If a new password is transmitted, we hash it.
        if (pass && pass.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(pass, salt);
        }

        const updated = await User.findOneAndUpdate(
            { email },
            updateFields,
            { new: true }
        );

        res.render(createPath("user"), { user: updated });

    } catch (err) {
        console.error(err);
        res.render(createPath("error"));
    }
};



/* const getUsers = (req, res) => {
    const title = 'My collection';

    User
        .find()
        .sort({ createdAt: -1 })
        .catch((error) => handleError(res, error));
}; */


const getUsers = async (req, res) => {
    try {
        const users = await User
            .find({}, { username: 1 })   // только нужные поля
            .sort({ createdAt: -1 });
        console.log('*********')
        res.render('sortingselection', {
            title: 'My collection',
            users
        });

    } catch (error) {
        handleError(res, error);
    }
};


const user = (req, res) => {
    const title = 'My collection';
    const userId = req.query.id;
    User
        .findById(userId)
        .then((user) => res.render(createPath('user'), { user }))
        .catch((error) => handleError(res, error));
};

const curuser = (req, res) => {
    const title = 'My collection';
    const userId = req.query.id;
    User
        .findById(userId)
        .then((user) => res.render(createPath('curuser'), { user }))
        .catch((error) => handleError(res, error));
};

const edituser = (req, res) => {
    const title = 'My collection';
    const userId = req.query.id;

    User
        .findById(userId)
        .then((user) => res.render(createPath('edit-user'), { user }))
        .catch((error) => handleError(res, error));
};


const login = (req, res) => {
    const { email, password: pass } = req.body;

    User
        .findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            };

            bcrypt.compare(pass, user.password, (err, result) => {
                if (err) {
                    return res.status(400).json({
                        message: 'Invalid password or email'
                    });
                }
                if (result) {
                    res.render(createPath('user'), { user });

                } else {
                    return res.status(400).json({
                        message: 'Invalid password or email'
                    });
                }
            }
            );
        })
        .catch((error) => handleError(res, error));
};

const addPost = (req, res) => {
    const { email, password } = req.body;
}

module.exports = {
    login,
    register,
    getUsers,
    addPost,
    user,
    curuser,
    edituser,
    updateuser,

};
