// Import Libraries:
import * as dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Declare Constances:
const apiKey = process.env.GOOGLE_API_KEY || "";

// Create Model:
const model = new ChatGoogleGenerativeAI({
  apiKey: apiKey,
  model: "gemini-1.5-flash",
  temperature: 0,
  // verbose: true,
});

// Create Prompt Template:
// const prompt = ChatPromptTemplate.fromTemplate(
//   "You are a comedian. Tell a joke based on the followiung word {input}"
// );
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a very funny comedian. Each of your joke are unique. Tell a joke based on the following word provided by the user.",
  ],
  ["human", "{input}"],
]);
// console.log(await prompt.format({ input: "chicken" }));

// Create Chain:
const chain_1 = prompt.pipe(model);

// Call Chain:
const response = await chain_1.invoke({
  input: "dog",
});

// Run:
console.log(response);
