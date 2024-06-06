const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/messages", require("./message.route"));
router.use("/users", require("./user.route"));

router.get("/testapi", (req, res, next) => {
	return res.status(200).json(`Chat App API`);
});

module.exports = router;
