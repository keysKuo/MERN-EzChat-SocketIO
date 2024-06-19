// Import Libraries:
import * as dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

// Declare Constances:
const apiKey = process.env.GOOGLE_API_KEY || "";

// Create Model:
const model = new ChatGoogleGenerativeAI({
  apiKey: apiKey,
  model: "gemini-1.5-flash",
  temperature: 0,
  // verbose: true,
});

async function callStringOutputParser() {
  // Create Prompt Template:
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a very funny and clever comedian. Each of your jokes are unique. Tell a joke based on the following word provided by the user.",
    ],
    ["human", "{input}"],
  ]);

  // Create Parser:
  const parser_1 = new StringOutputParser();

  // Create Chain:
  const chain_1 = prompt.pipe(model).pipe(parser_1); // the output of prompt becomes input for model, the output of model becomes input for parser_1, finally the result

  // Call Chain:
  return await chain_1.invoke({
    input: "dog",
  });
}

async function callListOutputParser() {
  // Create Prompt Template:
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You a dictonary. Provide 5 synonyms, seperated by commas, for the following word.",
    ],
    ["human", "{word}"],
  ]);
  const outputParser = new CommaSeparatedListOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    word: "angry",
  });
}

async function callStructuredOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase. If there is no information about a person's property, say "I have no information". DO NOT make up information.
    Formating instruction: {format_instruction}
    Phrase: {phrase}
    `);
  /* 
  The "output parser" re-format the response from the LLM.
  This type of "output parser" re-format the response into object type.
  While giving the re-format instruction (and the output), it also give instruction on how and which information to take data out to the prompt. 
 */
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    age: "the age of the person",
    gender: "the gender of the person",
  });
  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    phrase: "A 30 year-old boy from Sweden",
    format_instruction: outputParser.getFormatInstructions(),
  });
}

async function callZodOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase. If there is no information about a property, say "I have no information". DO NOT make up information.
    Formating instruction: {format_instruction}
    Phrase: {phrase}
    `);
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      recipe: z.string().describe("recipe name"),
      ingredients: z
        .array(
          z.object({
            ingredient: z.string().describe("ingredient name"),
            amount: z.number().describe("ingredient amount"),
            measure: z.string().describe("ingredient measurement"),
            factory: z.string().describe("ingredient producer"),
          })
        )
        .describe(
          "an array of object contains ingredients and ingredients' amount"
        ),
    })
  );
  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    phrase:
      "You will need 100 grams flour from Norway, 200 litters water and 50 yeat to make bread.",
    format_instruction: outputParser.getFormatInstructions(),
  });
}

// Run:
try {
  const response = await callZodOutputParser();
  console.log(response);
} catch (error) {
  console.error(error.message);
}
