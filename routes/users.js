const express = require('express');
const router = express.Router();
//const { protect, admin } = require('../middleware/authentication.js');
const {
  login,
  userUpdateProfile,
  userProfileGet,
  userRegister,
  deleteUser,
} = require('../controllers/usersController.js');

router.route('/register').post(userRegister);
router.post('/login', login);
router
  .route('/profile/:id')
  .get(userProfileGet)
  .put(userUpdateProfile)
  .delete(deleteUser);

module.exports = router;
