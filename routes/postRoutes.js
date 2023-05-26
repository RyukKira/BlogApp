const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const {
	createPost,
	getAllPosts,
	getSinglePost,
	updatePost,
	deletePost,
} = require('../controllers/postController');

router.route('/').post(authenticateUser, createPost).get(getAllPosts);
router
	.route('/:id')
	.get(getSinglePost)
	.patch(authenticateUser, updatePost)
	.delete(authenticateUser, deletePost);

module.exports = router;
