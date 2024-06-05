const userModel = require("../models/user.model");

class UserService {
	static async getOtherUsers({ userId }) {
		return await userModel
			.find({ _id: { $ne: userId } })
			.select("-password")
			.lean();
	}
}

module.exports = UserService;
