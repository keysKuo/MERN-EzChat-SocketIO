// Import Libraries:
import * as dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// Declare Constances:
const apiKey = process.env.GOOGLE_API_KEY || "";
// Main Functions:
try {
  //
  const model = new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    model: "gemini-1.5-flash",
    temperature: 0,
    // verbose: true,
  });
  //
  const response = await model.batch(["hello", "How are you?"]);
  console.log(response);
} catch (error) {
  console.error(error.message);
}
