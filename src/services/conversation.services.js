const mongoose = require("mongoose");
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

	static async getHistoryConversations({ userId }) {
		return await conversationModel
			.find({
				participants: { $in: [userId] },
			})
			.populate({
				path: "messages",
				options: {
					limit: 20, 
					select: "message sender receiver createdAt", 
				},
			})
			.populate({ path: "participants", select: "-password" })
			.lean()
			.then((conversations) => {
				return conversations.map((conv) => {
					return {
						...conv,
						partner: conv.participants.filter(
							(p) => p._id.toString() !== userId.toString()
						)[0],
					};
				});
			});
	}
}

module.exports = ConversationService;
