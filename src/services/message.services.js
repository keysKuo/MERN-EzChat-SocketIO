const { FileNotFoundError, ForbiddenError } = require('../middlewares/error.response');
const messageModel = require('../models/message.model');
const ConversationService = require('./conversation.services');

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

        return newMessage;
    }

    static async getMessages({ participants }) {
        const conversation = await ConversationService.getConversation({participants});
        return conversation?.messages || [];
    }
}

module.exports = MessageService;