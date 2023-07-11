const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

let whitelist = [
	"http://localhost:7000",
	"https://goal-setter-app-bay.vercel.app/",
];
app.use(
	cors({
		origin: function (origin, callback) {
			if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
				callback(null, true);
			} else {
				console.log(origin);
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: "GET,POST,PUT,DELETE",
		withCredentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	try {
		res.status(200).json({ message: "The app is working fine!" });
	} catch (err) {
		console.log(err);
		res.send("error");
	}
});

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log("Server is running on port: " + PORT));
