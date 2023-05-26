const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const {
	showCurrentUser,
	updateUser,
	updatePassword,
} = require('../controllers/userController');

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updatePassword').patch(authenticateUser, updatePassword);

module.exports = router;
