const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { filterData, generateKeys, generateTokens } = require("../ultils");

// Error handlers
const {
	BadRequestError,
	ForbiddenError,
	FileNotFoundError,
	AuthorizedError,
} = require("../middlewares/error.response");
const KeyStoreService = require("./keystore.services");
const configs = require("../configs");

class AuthService {
	static async refreshToken() {}

	static async signIn({ email, password }) {
		const existedUser = await userModel.findOne({ email }).lean();
		if (!existedUser)
			throw new FileNotFoundError(`❌ User Not Exists!`);
        
        const passwordMatched = await bcrypt.compare(password, existedUser.password);
		if (!passwordMatched)
			throw new AuthorizedError(`❌ Authentication Error!`);

		// Generate new Keys
		const { publicKey, privateKey } = generateKeys();
		if (!publicKey || !privateKey)
			throw new ForbiddenError(`❌ Generated KeyPair Fail!`);

		// Generate new Tokens
		const { accessToken, refreshToken } = await generateTokens(
			{ userId: existedUser._id },
			publicKey,
			privateKey
		);
		if (!accessToken || !refreshToken)
			throw new ForbiddenError(`❌ Create Tokens fail!`);

        await KeyStoreService.createKeyStore({
			userId: existedUser._id,
			publicKey,
			privateKey,
			refreshToken,
			refreshTokensUsed: []
		});

        return {
            user: filterData({
				object: existedUser,
				fields: ["_id", "username", "email", "gender", "avatar"],
			}),
			accessToken,
			refreshToken,
        }
	}

	static async logOut({ userId }) {
        const delkey = await KeyStoreService.deleteKeyStoreByUser(userId);

		if (!delkey) {
			throw new BadRequestError(`❌ Delete KeyStore Fail!`, 500);
		}

		return delkey;
    }


	static async signUp({ username, email, password, confirmPassword, gender }) {
		// Check existed User
		const existedUser = await userModel.countDocuments({ email });
		if (existedUser != 0)
			throw new BadRequestError(`❌ User already existed!`);

		if (password !== confirmPassword) 
			throw new BadRequestError(`❌ Password and Confirm Password must be same`);

		// Insert User to DB
		const random = Math.floor(Math.random() * 4) + 1;
		const maleAvatar = `${configs['frontendURL']}/male-avatar${random}.jpg`;
		const femaleAvatar = `${configs['frontendURL']}/female-avatar${random}.jpg`;
		const passwordHash = await bcrypt.hash(password, 10);
		const newUser = await userModel.create({
			username,
			email,
			password: passwordHash,
			gender,
			avatar: gender === "male" ? maleAvatar : femaleAvatar,
		});
		if (!newUser) throw new BadRequestError(`❌ Created user fail!`);

		// Generate new Keys
		const { publicKey, privateKey } = generateKeys();
		if (!publicKey || !privateKey)
			throw new ForbiddenError(`❌ Generated KeyPair Fail!`);

		// Generate new Tokens
		const { accessToken, refreshToken } = await generateTokens(
			{ userId: newUser._id },
			publicKey,
			privateKey
		);
		if (!accessToken || !refreshToken)
			throw new ForbiddenError(`❌ Create Tokens fail!`);

		return {
			user: filterData({
				object: newUser,
				fields: ["_id", "username", "email", "gender", "avatar"],
			}),
			accessToken,
			refreshToken,
		};
	}
}

module.exports = AuthService;
