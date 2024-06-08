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
			$push: message && { messages: message },
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
					limit: 50,
					sort: { createdAt: -1 },
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
						messages: conv.messages.reverse(),
					};
				});
			});
	}

	static async getHistoryConversations_v2({ userId }) {
		return await conversationModel
			.find({
				participants: { $in: [userId] },
			})
			.populate({
				path: "messages",
				options: {
					limit: 50,
					sort: { createdAt: -1 },
					select: "message sender receiver createdAt",
				},
			})
			.populate({ path: "participants", select: "-password" })
			.lean()
			.then((conversations) => {
				const conversationMap = {};
				
				conversations.forEach((conv) => {
					let partner = conv.participants.filter(
						(p) => p._id.toString() !== userId.toString()
					)[0];
					conversationMap[partner._id] = {
						...conv,
						partner,
						messages: conv.messages.reverse(),
					};
				});

				return conversationMap;
			});
	}
}

module.exports = ConversationService;
