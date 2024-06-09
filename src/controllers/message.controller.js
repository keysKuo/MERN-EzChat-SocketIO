const { SuccessResponse } = require("../middlewares/success.response");
const MessageService = require("../services/message.services");

class MessageController {
	static async sendMessage(req, res, next) {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const { message, conversationId } = req.body;

		return new SuccessResponse({
			code: 201,
			message: "✔️ Send message successfully",
			metadata: await MessageService.sendMessage({ senderId, receiverId, message, conversationId }),
		}).send({ response: res });
	}

    static async setUpConversation(req, res, next) {
        const { email } = req.body;
		return new SuccessResponse({
			code: 201,
			message: "✔️ Conversation setup successfully",
			metadata: await MessageService.setUpConversation({
				email,
				userId: req.user._id,
			}),
		}).send({ response: res });
	}
}

module.exports = MessageController;