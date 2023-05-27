const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
	name: String,
	contentType: String,
	size: Number,
	path: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('File', FileSchema);
