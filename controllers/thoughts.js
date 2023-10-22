const { response } = require('express');
const Thought = require('../models/thought');
const User = require('../models/user');

const getThoughts = async (req, res) => {

    const thoughts = await Thought.find();

    res.json({
        ok: true,
        thoughts
    });

}

const getThoughtById = async (req, res = response) => {

    const id = req.params.id;

    try {
        const thought = await Thought.findById(id);

        res.json({
            ok: true,
            thought
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Unexpected error'
        })
    }
}

const createThought = async (req, res = response) => {

    const { username } = req.body;

    try {

        const thought = new Thought(req.body);
        await thought.save();

        res.json({
            ok: true,
            thought,
        });

        const userDB = await User.findOne({ username });
        if (userDB) {
            userDB.thoughts.push(thought.id);
            const updatedUser = await User.findByIdAndUpdate(userDB.id, userDB);
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }

}


const updateThought = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const thoughtDB = await Thought.findById(uid);

        if (!thoughtDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Thought not found'
            });
        }

        const updatedThought = await Thought.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            thought: updatedThought
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }

}


const deleteThought = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const thoughtDB = await Thought.findById(uid);

        if (!thoughtDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Thought not found'
            });
        }

        await Thought.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Thought deleted'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }

}

const addReaction = async (req, res = response) => {

    const thoughtId = req.params.thoughtId;
    const reaction = req.body;

    try {

        const thoughtDB = await Thought.findById(thoughtId);

        if (!thoughtDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Thought not found'
            });
        }

        thoughtDB.reactions.push(reaction);
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, thoughtDB);
        const result = await Thought.findById(thoughtId);

        res.json({
            ok: true,
            thought: result
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }

}

const deleteReaction = async (req, res = response) => {

    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    try {

        const thoughtDB = await Thought.findById(thoughtId);

        if (!thoughtDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Thought not found'
            });
        }

        const index = thoughtDB.reactions.findIndex(r => reactionId === (r.reactionId).toString());
        if (index === -1) {
            return res.status(404).json({
                ok: false,
                msg: 'Reaction not found'
            });
        }

        thoughtDB.reactions.splice(index, 1);
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, thoughtDB);
        const result = await Thought.findById(thoughtId);

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
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
}