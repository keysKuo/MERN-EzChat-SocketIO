const { model, Schema, Types } = require("mongoose");

const conversationSchema = new Schema(
	{
		participants: [{ type: Types.ObjectId, ref: "User" }],
		messages: {
			type: [{ type: Types.ObjectId, ref: "Message" }],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model("Conversation", conversationSchema);
