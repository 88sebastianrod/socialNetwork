/*
    Path: /api/thoughts
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { getThoughts, getThoughtById, createThought, updateThought, deleteThought, addReaction, deleteReaction } = require('../controllers/thoughts');
const router = Router();


router.get('/', getThoughts);

router.get('/:id', getThoughtById);

router.post('/',
    [
        check('thoughtText', 'The thought text is required').not().isEmpty(),
        check('username', 'The username is required').not().isEmpty(),
        validateFields,
    ],
    createThought
);

router.put('/:id',
    [
        check('thoughtText', 'The thought text is required').not().isEmpty(),
        check('username', 'The username is required').not().isEmpty(),
        validateFields,
    ],
    updateThought
);

router.delete('/:id', deleteThought);

/*
    Path: /api/thoughts/:thoughtId/reactions'
*/
router.post('/:thoughtId/reactions', addReaction);

router.delete('/:thoughtId/reactions/:reactionId', deleteReaction);


module.exports = router;