const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token;

	try {
		if (!token) {
			throw new CustomError.UnauthenticatedError('Authentication failed.');
		}

		const { name, userId } = isTokenValid({ token });
		req.user = { name, userId };
		next();
	} catch (error) {
		console.log(error);
	}
};

module.exports = authenticateUser;
