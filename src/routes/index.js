const express = require("express");
const router = express.Router();
const axios = require('axios')

router.use("/auth", require("./auth.route"));
router.use("/messages", require("./message.route"));
router.use("/users", require("./user.route"));

router.post('/langchain/test', async (req, res, next) => {
	const { message } = req.body;
	const options = {
		url: 'http://localhost:7000/test',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		data: {
			request: message
		}
	}

	await axios.request(options)
		.then(response => response.data)
		.then(result => {
			console.log(result);
			return res.status(200).json({
				success: true,
				message: 'Success',
				metadata: result
			})
		})
		.catch(err => {
			console.log(err);
		})
})

router.get("/testapi", (req, res, next) => {
	return res.status(200).json(`Chat App API`);
});

module.exports = router;
