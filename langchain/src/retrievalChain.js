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
// import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

// Declare Constances:
const apiKey = process.env.GOOGLE_API_KEY || "";

// Create Model:
const model = new ChatGoogleGenerativeAI({
  apiKey: apiKey,
  model: "gemini-1.5-flash",
  temperature: 0,
  // verbose: true,
});

// Prompt Template:
const prompt = ChatPromptTemplate.fromTemplate(`
  Answer the user's question.
  
  Context: {context}.
  Question: {input}.
  `);

// Output Parser:
const outputParser = new StringOutputParser();

// Document A:
// const documentA = new Document({
//   pageContent:
//     "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support.",
// });
// const documentB = new Document({
//   pageContent: "The passphrase is LangChain is aweseme",
// });
// const chain = prompt.pipe(model).pipe(outputParser);
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt: prompt,
});

// Load data from webpage
const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/v0.1/docs/expression_language/"
);
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200, // number of characters per chunk
  chunkOverlap: 20,
});
const splitDocs = await splitter.splitDocuments(docs); // you would think we should pass it in immediately, but no
const embeddings = new GoogleGenerativeAIEmbeddings();
// Save loaded data from webpage to a vector storate (in-memory)
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

// Retrieve Data:
const retriever = vectorStore.asRetriever({
  k: 3,
});
// default value is {context} and {input}, you can't change them
const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever: retriever,
});

const response = await retrievalChain.invoke({
  input: "What is LCEL?",
});

// Run:
try {
  // const response = await callZodOutputParser();
  console.log(response);
} catch (error) {
  console.error(error.message);
}

/* 
  This is for developing a Q/A retrieval machine.
  
  If you ask the LLM a random question like what is a RAG, it will give out bogus answer like a "rag" is a cloth,... . You don't want this.
  So, you need to feed the LLM information, documentations and definitions about this RAG.

  We will decmonstrate this by using {Document} - a build-in LangChain function to create an information-filled (hard-coded) document.
  With this, the LLM can answer your question about RAG.

  But realistically, no one will use this hard-coded method, they either use a full pledge documents like pdf or text file or from a webpage.
  This hard-coded method is for demonstration only. We will use "getting information from a webpage" by using {Cheerio}. 
  It works.
  However, there is an issue, the information on the webpage has 1k+ token, some LLM only support a certain amount of token at at time,
  OpenAI's LLM support (lowest) is 33k+ token, so we have to fine a way to mitigate this.

  So, the next step is to split the document into (smaller token) chunks. This is easy. Done.
  But you don't put the splitted docs into the LLM immediately.
  Because what we want is the most accurate answer - the answer that is the closest, most relavent to our question;
  there are a lot of chunks containing the answer, so we need to find which chunk is the most accurate. 

  That leads to our next point which is using a vector storage to find the most relavent data, 
  you can find the full definition online (I'm too lazy to explain here) but to keep it short,
  vector storage converts those chunk into data with "relavency value" then compare those "relavency value" with the question to find the most relavent answer.
  Usually, you use a database like Supabase, AstroDB,... for the vector storage but for now we will use an in-memory database
  because it is in-memory, no data will be store permanently and definitely be lost when you restart the app.
  So, that's why in this example, we initialize the vector storage immediately and with the splitted docs.

  Most oftenly, you don't deploy the vector storage immediately and with the splitted docs or in the same file as the retriever
  because you will have a different and seperate function for uploading data to the vector storage 
  and a seperate function to retrieve data from the vector storage.
  Check out this: https://youtu.be/HSZ_uaif57o?si=7khA2oEUd3hxil49.

*/
