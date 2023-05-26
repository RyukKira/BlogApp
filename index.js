require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

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
