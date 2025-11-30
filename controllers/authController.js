const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');

const createPath = require('../helpers/create-path.js');

const fs = require('fs');

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


const register = async (req, res) => {

    const { username, firstName, lastName, email, password: pass, role } = req.body;
    let str64;

    if (req.file) { str64 = req.file.buffer.toString("base64") }
    else { str64 = "" };

    const bodystr64 = str64;


    const message = 'User with this email already exists....';
    const message1 = 'User with this email already exists+++++';

    User
        .findOne({ email })
        .then((user) => {
            if (user) {
                if (user.email === email) {
                    res.render(createPath('register'), { message });
                }
            }
        });


    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    const curuser = null;
    const user = new User({ username, firstName, lastName, email, password: hash, role, foto: bodystr64 });
    user
        .save()
        .then((user) => res.render(createPath('user'), { user }))
        .catch(() => res.render(createPath('error'), { message1 }));
}


const updateuser = async (req, res) => {
    const { username, firstName, lastName, email, password: pass, role } = req.body;
    let str64 = req.file ? req.file.buffer.toString("base64") : "";

    const updateFields = {
        username,
        firstName,
        lastName,
        email,
        ...(str64 && { foto: str64 }),
    };

    // Только если пароль передан — хэшируем и добавляем в обновление
    if (pass && pass.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);
        updateFields.password = hash;
    }

    const message1 = 'User with this email already exists+++++';

    User
        .findOneAndUpdate(
            { email },
            updateFields,
            { new: true }
        )
        .then((user) => res.render(createPath('user'), { user }))
        .catch(() => res.render(createPath('error'), { message1 }));
}

const getUsers = (req, res) => {
    const title = 'My collection';

    User
        .find()
        .sort({ createdAt: -1 })
        .catch((error) => handleError(res, error));
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
