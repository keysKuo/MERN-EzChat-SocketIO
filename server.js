require("dotenv").config();
const express = require('express');
const configs = require("./src/configs");
const { server, app } = require("./src/socket");

const { default: helmet } = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const path = require("path");

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

require("./src/dbs/init.mongodb"); // Singleton - A method or class that only construct once

app.use("/api/v1", require("./src/routes"));

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

server.listen(configs["port"], () => {
	console.log(`🚀 Server ready on port ${configs["port"]}`);
});
