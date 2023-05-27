const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		message: {
			text: {
				type: String,
			},
			media: {
				type: Buffer,
			},
		},
		author: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Post', PostSchema);
