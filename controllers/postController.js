const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createPost = async (req, res, next) => {
	req.body.user = req.user.userId;

	try {
		const post = await Post.create(req.body);
		res.status(StatusCodes.CREATED).json({ post });
	} catch (error) {
		next(error);
	}
};

const getAllPosts = async (req, res, next) => {
	const { message, author } = req.query;

	try {
		const queryObject = {};

		if (message) {
			queryObject.message = { message };
		}

		if (author) {
			queryObject.author = { author };
		}

		let result = Post.find(queryObject);
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		result = result.skip(skip).limit(limit);

		const posts = await result;
		res.status(StatusCodes.OK).json({ posts, count: posts.length });
	} catch (error) {
		next(error);
	}
};

const getSinglePost = async (req, res, next) => {
	const { id: postId } = req.params;

	try {
		const post = await Post.findOne({ _id: postId });

		if (!post) {
			throw new CustomError.NotFoundError(`No post found with ${postId} id.`);
		}
		res.status(StatusCodes.OK).json({ post });
	} catch (error) {
		next(error);
	}
};

const updatePost = async (req, res, next) => {
	const { id: postId } = req.params;

	try {
		const post = await Post.findOneAndUpdate({ _id: postId }, req.body, {
			new: true,
			runValidators: true,
		});

		if (!post) {
			throw new CustomError.NotFoundError(`No post found with ${postId} id.`);
		}
		res.status(StatusCodes.OK).json({ post });
	} catch (error) {
		next(error);
	}
};

const deletePost = async (req, res, next) => {
	const { id: postId } = req.params;

	try {
		const post = await Post.findOneAndDelete({ _id: postId });

		if (!post) {
			throw new CustomError.NotFoundError(`No post found with ${postId} id.`);
		}
		res.status(StatusCodes.OK).json({ post });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createPost,
	getAllPosts,
	getSinglePost,
	updatePost,
	deletePost,
};
