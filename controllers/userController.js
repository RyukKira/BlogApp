const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

const showCurrentUser = async (req, res, next) => {
	try {
		res.status(StatusCodes.OK).json({ user: req.user });
	} catch (error) {
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	const { email, name } = req.body;

	try {
		if (!email || !name) {
			throw new CustomError.BadRequestError('Please provide all values.');
		}

		const user = await User.findOne({ _id: req.user.userId });
		user.email = email;
		user.name = name;
		await user.save();

		const tokenUser = createTokenUser(user);
		attachCookiesToResponse({ res, user: tokenUser });
		res.status(StatusCodes.OK).json({ user: tokenUser });
	} catch (error) {
		next(error);
	}
};

const updatePassword = async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;

	try {
		if (!oldPassword || !newPassword) {
			throw new CustomError.BadRequestError('Please provide all values.');
		}

		const user = await User.findOne({ _id: req.user.userId });
		const isPasswordCorrect = await user.comparePassword(oldPassword);
		if (!isPasswordCorrect) {
			throw new CustomError.UnauthenticatedError('Invalid credentials.');
		}
		user.password = newPassword;

		await user.save();
		res.status(StatusCodes.OK).json({ msg: 'Success, password updated.' });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	showCurrentUser,
	updateUser,
	updatePassword,
};
