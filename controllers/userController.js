const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Please provide all the details");
	}

	// Check if user exists
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create user
	const newUser = await User.create({
		name,
		email,
		password: hashedPassword,
	});

	if (newUser) {
		res.status(201).json({
			_id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			token: generateToken(newUser.id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc    Autheticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			message: "Logged In",
			token: generateToken(user.id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid credentials");
	}
});

// Generate JWT
function generateToken(id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
}

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

module.exports = {
	registerUser,
	loginUser,
	getMe,
};
