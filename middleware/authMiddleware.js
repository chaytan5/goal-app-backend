const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from headers
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.decode(token, process.env.JWT_SECRET);

			// get user from the token
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (err) {
			console.log(err);
			res.status(401);
			throw new Error("Not Authorised");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

module.exports = { protect };
