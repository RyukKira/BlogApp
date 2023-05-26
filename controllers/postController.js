const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createPost = async (req, res) => {
	req.body.user = req.user.userId;
	const post = await Post.create(req.body);
	res.status(StatusCodes.CREATED).json({ post });
};

const getAllPosts = async (req, res) => {
	const { message, author } = req.query;
	const queryObject = {};

	if (message) {
		queryObject.message = { message };
	}

	if (author) {
		queryObject.author = { author };
	}

	let result = Product.find(queryObject);
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const posts = await result;
	res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

const getSinglePost = async (req, res) => {
	const { id: productId } = req.params;
	const post = await Post.findOne({ _id: productId });

	if (!post) {
		throw new CustomError.NotFoundError(`No post found with ${productId} id.`);
	}
	res.status(StatusCodes.OK).json({ post });
};

const updatePost = async (req, res) => {
	const { id: productId } = req.params;
	const post = await Post.findOneAndUpdate({ _id: productId }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!post) {
		throw new CustomError.NotFoundError(`No post found with ${productId} id.`);
	}
	res.status(StatusCodes.OK).json({ post });
};

const deletePost = async (req, res) => {
	const { id: productId } = req.params;
	const post = await Post.findOneAndDelete({ _id: productId });

	if (!post) {
		throw new CustomError.NotFoundError(`No post found with ${productId} id.`);
	}
	res.status(StatusCodes.OK).json({ post });
};

module.exports = {
	createPost,
	getAllPosts,
	getSinglePost,
	updatePost,
	deletePost,
};
