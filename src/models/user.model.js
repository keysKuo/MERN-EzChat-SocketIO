const { model, Schema, Types } = require("mongoose");

const userSchema = new Schema(
	{
		fullname: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, required: true },
		gender: { type: String, enum: ["male", "female"] },
	},
	{
		timestamps: true,
	}
);

module.exports = model('User', userSchema);