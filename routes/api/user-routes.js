const router = require('express').Router();
const {
    createUser, 
    getSingleUser,
    getAllUsers,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');


router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/:userId/friends/:friendsId').post(addFriend).delete(deleteFriend);

module.exports = router;