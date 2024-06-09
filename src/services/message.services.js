const { FileNotFoundError, ForbiddenError } = require('../middlewares/error.response');
const messageModel = require('../models/message.model');
const { getReceiverSocketId, io } = require('../socket');
const ConversationService = require('./conversation.services');
const UserService = require('./user.services');

class MessageService {
    static async sendMessage({ senderId, receiverId, message, conversationId }) {
        // CHECK IF CONVERSATION EXISTED
        const isExistedConv = await ConversationService.isExisted({conversationId});
        if (!isExistedConv) throw new FileNotFoundError("❌ Conversation Not Existed");

        // CREATE NEW MESSAGE
        const newMessage = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            message,
            conversation: conversationId
        });
        if (!newMessage) throw new ForbiddenError('❌ Send Message Error');

        // PUSH NEW MESSAGES TO MESSAGES LIST IN CONVERSATION
        await ConversationService.updateConversation({
            conversationId,
            payload: { $push: { messages: newMessage._id }}
        })

        // SEND SOCKET NOTIFICATION TO RECEIVER
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return newMessage;
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