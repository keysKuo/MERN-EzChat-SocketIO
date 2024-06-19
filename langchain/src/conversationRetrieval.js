// Import Libraries:
import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { MessagesPlaceholder } from "@langchain/core/prompts";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

// Declare Constances:
const apiKey = process.env.GOOGLE_API_KEY || "";

// Output Parser:
const outputParser = new StringOutputParser();

const createVectorStore = async () => {
  const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/v0.1/docs/expression_language/"
  );
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200, // number of characters per chunk
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new GoogleGenerativeAIEmbeddings();

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  return vectorStore;
};

const createChain = async (vectorStore) => {
  const model = new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    model: "gemini-1.5-flash",
    temperature: 0,
    // verbose: true,
  });
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's question based on the following context: {context}.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
  ]);
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,
  });

  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  const retrieverPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);
  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever: retriever,
    rephrasePrompt: retrieverPrompt,
  });

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: historyAwareRetriever,
    // default value is {context} and {input}, you can't change them
  });

  return retrievalChain;
};

// Test array chat history
const chatHistory = [
  new HumanMessage("Hello"),
  new AIMessage("Hi, how can I help you?"),
  new HumanMessage(
    "My name is Aaron. I have a male 3 year-old German Shepherd dog name Donny."
  ),
  new AIMessage("Hi Aaron, how can I help you?"),
  new HumanMessage("What is LCEL?"),
  new AIMessage("LCEL stands for LangChain Expression Language"),
];

// Run:
try {
  const vectorStore = await createVectorStore();
  const chain = await createChain(vectorStore);
  const response = await chain.invoke({
    input: "What is it?",
    chat_history: chatHistory,
  });
  console.log(response);
} catch (error) {
  console.error(error.message);
}

/* 
  write note about 

*/