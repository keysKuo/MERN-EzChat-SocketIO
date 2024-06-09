const { FileNotFoundError, ForbiddenError } = require('../middlewares/error.response');
const messageModel = require('../models/message.model');
const { getReceiverSocketId, io } = require('../socket');
const ConversationService = require('./conversation.services');
const UserService = require('./user.services');

class MessageService {
    static async sendMessage({ senderId, receiverId, message}) {
        const newMessage = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            message
        });
        if (!newMessage) throw new ForbiddenError('❌ Send Message Error');

        const conversation = await ConversationService.setUpConversation({ senderId, receiverId, message: newMessage._id});
        if (!conversation) throw new FileNotFoundError('❌ Conversation Not Found');

        // SEND SOCKET
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return newMessage;
    }

    static async getMessages({ participants }) {
        const conversation = await ConversationService.getConversation({participants});
        return conversation?.messages || [];
    }

    static async setUpConversation({ email, userId }) {
		const receiver = await UserService.searchUserByEmail({ email, userId });
		const conversation = await ConversationService.setUpConversation({
			senderId: userId,
			receiverId: receiver._id
		})
		if (!conversation) throw new ForbiddenError("❌ Setup conversation error");
		
		// SEND SOCKET
        const receiverSocketId = getReceiverSocketId(receiver._id);
        const senderSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newConversation", conversation);
            io.to(senderSocketId).emit("newConversation", conversation);
        }

		return conversation;
	}
}

module.exports = MessageService;