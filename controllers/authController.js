const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const registerUser = async (req, res, next) => {
	const { email, name, password } = req.body;

	try {
		if (!email || !name || !password) {
			throw new CustomError.BadRequestError(
				'Provide an email address, name and password.',
			);
		}

		const emailAlreadyExists = await User.findOne({ email });
		if (emailAlreadyExists) {
			throw new CustomError.BadRequestError('Email already exists.');
		}

		const user = await User.create({ name, email, password });
		const tokenUser = createTokenUser(user);
		attachCookiesToResponse({ res, user: tokenUser });
		res.status(StatusCodes.CREATED).json({ user: tokenUser });
	} catch (error) {
		next(error);
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new CustomError.UnauthenticatedError('Invalid email.');
		}

		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			throw new CustomError.UnauthenticatedError('Invalid password.');
		}

		const tokenUser = createTokenUser(user);
		attachCookiesToResponse({ res, user: tokenUser });
		res.status(StatusCodes.OK).json({ user: tokenUser });
	} catch (error) {
		next(error);
	}
};

const logoutUser = async (req, res, next) => {
	try {
		res.cookie('token', 'logout', {
			httpOnly: true,
			expires: new Date(Date.now()),
		});
		res.status(StatusCodes.OK).json({ msg: 'User logged out.' });
	} catch (error) {
		next(error);
	}
};

module.exports = { registerUser, loginUser, logoutUser };
