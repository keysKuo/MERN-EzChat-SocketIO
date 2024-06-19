import dotenv from "dotenv";
import express from "express";
const app = express();
const PORT = 7000;
dotenv.config();

import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import chain from "./demo.js";
import Schema from "./schema.js";

app.use(morgan("dev"));
app.use(compression());
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

app.post("/test", async (req, res, next) => {
	try {
        const { request } = req.body;

		const schema = Schema;
		// console.log(Schema)

		const response = await chain.invoke({
			schema: schema,
			user_input: request,
			// column: "*",
		});

		return res.status(200).json(response);
	} catch (error) {
		// console.log(error);
		return res.status(500).json(error);
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server ready on port ${PORT}`);
});
