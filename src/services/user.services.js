const { FileNotFoundError, ForbiddenError } = require("../middlewares/error.response");
const userModel = require("../models/user.model");
const { getReceiverSocketId, io } = require("../socket");
const ConversationService = require("./conversation.services");

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

	static async setUpConversation({ email, userId }) {
		const receiver = await this.searchUserByEmail({ email, userId });
		const conversation = await ConversationService.setUpConversation({
			senderId: userId,
			receiverId: receiver._id
		})
		if (!conversation) throw new ForbiddenError("❌ Setup conversation error");
		
		// SEND SOCKET
        const receiverSocketId = getReceiverSocketId(receiver._id);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newConversation", conversation);
        }

		return conversation;
	}
}

module.exports = UserService;
