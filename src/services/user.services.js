const { FileNotFoundError } = require("../middlewares/error.response");
const userModel = require("../models/user.model");

class UserService {
	static async getOtherUsers({ userId }) {
		return await userModel
			.find({ _id: { $ne: userId } })
			.select("-password")
			.lean();
	}

	static async searchUserByEmail({ email, userId }) {
		const searchUser =  await userModel
			.findOne({ email, _id: { $ne: userId } })
			.select("-password")
			.lean();

		if (!searchUser) throw new FileNotFoundError('❌ User Not Found');
		return searchUser;
	}
}

module.exports = UserService;
