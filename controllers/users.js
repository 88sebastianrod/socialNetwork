const { response } = require('express');
const User = require('../models/user');
const Thought = require('../models/thought');

const getUsers = async (req, res) => {

    const users = await User.find();

    res.json({
        ok: true,
        users
    });

}

const getUserById = async (req, res = response) => {

    const id = req.params.id;

    try {
        const user = await User.findById(id);

        res.json({
            ok: true,
            user
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Unexpected error'
        })
    }
}

const createUser = async (req, res = response) => {

    const { email } = req.body;

    try {

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'This email is already registered'
            });
        }

        const user = new User(req.body);
        await user.save();

        res.json({
            ok: true,
            user,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }

}


const updateUser = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        const { email } = req.body;

        if (userDB.email !== email) {

            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    ok: false,
                    msg: 'This email is already registered'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            user: updatedUser
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }

}


const deleteUser = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        for (const thoughtId of userDB.thoughts) {
            await Thought.findByIdAndDelete(thoughtId);
        }

        await User.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'User deleted'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }

}

const addFriend = async (req, res = response) => {

    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {

        const userDB = await User.findById(userId);
        const firiendUserDB = await User.findById(friendId);

        if (!userDB || !firiendUserDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        userDB.friends.push(friendId);
        const updatedUser = await User.findByIdAndUpdate(userId, userDB);
        const result = await User.findById(userId);

        res.json({
            ok: true,
            user: result
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }

}

const deleteFriend = async (req, res = response) => {

    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {

        const userDB = await User.findById(userId);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        const index = userDB.friends.indexOf(friendId);
        if (index === -1) {
            return res.status(404).json({
                ok: false,
                msg: 'Friend not found'
            });
        }

        userDB.friends.splice(index, 1);
        const updatedUser = await User.findByIdAndUpdate(userId, userDB);
        const result = await User.findById(userId);

        res.json({
            ok: true,
            user: result
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }

}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
}