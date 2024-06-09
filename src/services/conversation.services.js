const conversationModel = require("../models/conversation.model");
const { Types } = require("mongoose");

class ConversationService {
	static async setUpConversation({ senderId, receiverId }) {
		const filter = {
			$or: [
				{ participants: [senderId, receiverId] },
				{ participants: [receiverId, senderId] },
			],
		};
		const update = {
			$set: { participants: [senderId, receiverId] },
		};

		const options = { upsert: true, new: true };

		return await conversationModel
			.findOneAndUpdate(filter, update, options)
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
			.then((conv) => {
				return {
					...conv,
					partner: conv.participants.filter(
						(p) => p._id.toString() !== senderId.toString()
					)[0],
					messages: conv.messages.reverse(),
				};
			});
	}

	static async isExisted({ conversationId }) {
		const count = await conversationModel.countDocuments({
			_id: new Types.ObjectId(conversationId),
		});
		return count > 0;
	}

	static async updateConversation({ conversationId, payload }) {
		return await conversationModel.updateOne(
			{ _id: conversationId },
			payload
		);
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
					conversationMap[conv._id] = {
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
