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

const schema = `
  CREATE TABLE dbo.Student(
    student_id varchar(10) primary key,
    first_name nvarchar(10),
    last_name nvarchar(10),
    city nvarchar(64),
    age int
  )
`;

const prompt = ChatPromptTemplate.fromTemplate(`
  Given the database schema: {schema}.
  Generate a SQL SELECT query for the following user input: {user_input}.
  
  Only displays 3 properties in the schema. The schema's primary key(s) must always be used in SELECT query.
  If there are tables need to be joined, always use 'JOIN' to join tables.
  Always use 'LIMIT' to limit the out to 50 rows.
  `);

  // Select only these column: {column}.

  // Do not use '*' when using generating SELECT.

const outputParser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(outputParser);

export default chain;

// const response = await chain.invoke({
//   schema: schema,
//   user_input: "Find students who have age above 10",
//   column: "student_id, first_name, last_name, age",
// });

// // Run:
// try {
//   // const response = await callZodOutputParser();
//   console.log(response);
// } catch (error) {
//   console.error(error.message);
// }

// dùng video cảu ông kia để lấy data từ trong đặc tả user input, sau đó mới bắt đầu xử lý, keyword: extract information from
