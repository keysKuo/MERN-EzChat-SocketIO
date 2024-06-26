const { model, Schema, Types } = require("mongoose");

const messageSchema = new Schema(
	{
		sender: { type: Types.ObjectId, ref: "User", required: true },
		receiver: { type: Types.ObjectId, ref: "User", required: true },
		message: { type: String, required: true },
		conversation: { type: Types.ObjectId, ref: 'Conversation' , required: true, index: true }
	},
	{
		timestamps: true,
	}
);

module.exports = model("Message", messageSchema);
