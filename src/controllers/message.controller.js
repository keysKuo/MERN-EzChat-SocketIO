const { SuccessResponse } = require("../middlewares/success.response");
const MessageService = require("../services/message.services");

class MessageController {
	static async sendMessage(req, res, next) {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const { message } = req.body;

		return new SuccessResponse({
			code: 201,
			message: "✔️ Send message successfully",
			metadata: await MessageService.sendMessage({ senderId, receiverId, message }),
		}).send({ response: res });
	}

    static async getMessages(req, res, next) {
        const { targetId } = req.params;
        const userId = req.user._id;
        
        return new SuccessResponse({
            code: 200,
            message: '✔️ Get messages successfully',
            metadata: await MessageService.getMessages({ 
                participants: [userId, targetId]
            })
        }).send({ response: res })
    }
}

module.exports = MessageController;