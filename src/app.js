const express = require("express");
const app = express();
require("dotenv").config();
const { default: helmet } = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const path = require("path");
const configs = require("./configs");

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors({
	origin: configs['frontendURL'],
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	expressSession({
		secret: "nkeyskuo SUDTECHNOLOGY",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);
app.use(express.static(path.join(__dirname, "public")));

require("./dbs/init.mongodb"); // Singleton - A method or class that only construct once
checkOverload();

app.use("/api/v1", require("./routes"));

app.get('/static/:resource', (req, res, next) => {
	const { resource } = req.params;
	res.sendFile(path.join(__dirname, `public`, resource));
})

// init routers
app.get("/", (req, res, next) => {
	return res.status(200).json({
		msg: "Server Initialization",
	});
});

// handling error

app.use((req, res, next) => {
	const error = new Error("❌ 404 Not Found");
	error.status = 404;

	next(error);
});

app.use((err, req, res, next) => {
	const statusCode = err.code || 500;
	return res.status(statusCode).json({
		success: false,
		code: statusCode,
		// stack: err.stack,
		message: err.message || "❌ Internal Server Error",
	});
});

module.exports = app;
