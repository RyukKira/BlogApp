require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');
const Post = require('./models/Post');
const File = require('./models/File');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connectDB = require('./db/connect');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.post('/api/v1/posts/upload', upload.single('file'), async (req, res) => {
	try {
		const file = new File({
			name: req.file.originalname,
			contentType: req.file.mimetype,
			size: req.file.size,
			path: req.file.path,
		});

		await file.save();
		res
			.status(StatusCodes.OK)
			.json({ file, msg: 'FIle uploaded successfully.' });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: 'Error uploading file.' });
	}
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 3000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, console.log(`Server is listening on ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
