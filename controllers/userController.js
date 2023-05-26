const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
	const { email, name } = req.body;
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
};

const updatePassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new CustomError.BadRequestError('Please provide all values.');
	}

	const user = await User.findOne({ _id: req.user.userId });
	const isPasswordCorrect = await User.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError('Invalid credentials.');
	}
	user.password = newPassword;

	await user.save();
	res.status(StatusCodes.OK).json({ msg: 'Success, password updated.' });
};

module.exports = {
	showCurrentUser,
	updateUser,
	updatePassword,
};
