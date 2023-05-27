const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter your name.'],
		minlength: 3,
		maxlength: 15,
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Please enter your email address.'],
		validate: {
			validator: validator.isEmail,
			message: 'Please enter a valid email address',
		},
	},
	password: {
		type: String,
		required: [true, 'Please provide a password.'],
		minlength: [8, 'Password must be at least 8 characters.'],
		maxlength: 255,
	},
});

UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatching = await bcrypt.compare(candidatePassword, this.password);
	return isMatching;
};

module.exports = mongoose.model('User', UserSchema);
