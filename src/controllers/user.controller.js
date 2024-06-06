const { SuccessResponse } = require("../middlewares/success.response");
const ConversationService = require("../services/conversation.services");
const UserService = require("../services/user.services");

class UserController {
	static async getOtherUsers(req, res, next) {
		const userId = req.user._id;
		const metadata = await UserService.getOtherUsers({ userId });
		return new SuccessResponse({
			code: 200,
			message: `✔️ Found ${metadata.length} Other Users`,
			metadata,
		}).send({ response: res });
	}

	static async getHistoryConversations(req, res, next) {
		const userId = req.user._id;
		const metadata = await ConversationService.getHistoryConversations({userId});
		return new SuccessResponse({
			code: 200,
			message: `✔️ Found ${metadata.length} Conversations`,
			metadata,
		}).send({ response: res });
	}
}

module.exports = UserController;
