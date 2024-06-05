const conversationModel = require("../models/conversation.model");

class ConversationService {
	static async setUpConversation({ senderId, receiverId, message }) {
		const filter = {
			$or: [
				{ participants: [senderId, receiverId] },
				{ participants: [receiverId, senderId] },
			],
		};
		const update = {
			$set: { participants: [senderId, receiverId] },
			$push: { messages: message },
		};
		const options = { upsert: true, new: true };

		return await conversationModel.findOneAndUpdate(
			filter,
			update,
			options
		);
	}

	static async getConversation({ participants }) {
		return await conversationModel
			.findOne({
				participants: { $all: participants },
			})
			.populate("messages")
			.lean();
	}
}

module.exports = ConversationService;
