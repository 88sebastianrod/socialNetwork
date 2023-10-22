/*
    Path: /api/users
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { getUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriend } = require('../controllers/users');
const router = Router();


router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/',
    [
        check('username', 'The username is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        validateFields,
    ],
    createUser
);

router.put('/:id',
    [
        check('username', 'The username is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        validateFields,
    ],
    updateUser
);

router.delete('/:id', deleteUser);

/*
    Path: /api/users/:userId/friends/:friendId
*/
router.post('/:userId/friends/:friendId', addFriend);

router.delete('/:userId/friends/:friendId', deleteFriend);


module.exports = router;