import * as dotenv from "dotenv";
dotenv.config();
import readline from "readline";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { MessagesPlaceholder } from "@langchain/core/prompts";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";

import { createRetrieverTool } from "langchain/tools/retriever";

// Langfuse
import { CallbackHandler } from "langfuse-langchain";
const langfuseHandler = new CallbackHandler({
  publicKey: "pk-lf-c9451757-9223-43a3-a8ae-2e4ba79fcda6",
  secretKey: "sk-lf-eb2bc2a9-7611-485c-bc1c-4bfd811116b8",
  baseUrl: "https://cloud.langfuse.com",
});

//
const loader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/user_guide"
);
const rawDocs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const docs = await splitter.splitDocuments(rawDocs);

const vectorstore = await MemoryVectorStore.fromDocuments(
  docs,
  new GoogleGenerativeAIEmbeddings()
);
const retriever = vectorstore.asRetriever();

// Declare Constances:
const apiKey = process.env.GOOGLE_API_KEY || "";

const model = new ChatGoogleGenerativeAI({
  apiKey: apiKey,
  model: "gemini-1.5-flash",
  temperature: 0,
  // verbose: true,
});

const prompt = ChatPromptTemplate.fromMessages([
  ("system", "You are a helpful assistant called Max."),
  new MessagesPlaceholder("chat_history"),
  ("human", "{input}"),
  new MessagesPlaceholder("agent_scratchpad"),
]);

// Create and Assign tools
const retrieverTool = createRetrieverTool(retriever, {
  name: "langsmith_search",
  description:
    "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
});
const searchTool = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 1,
});
const tools = [retrieverTool];

// Create agent
const agent = await createOpenAIFunctionsAgent({
  llm: model,
  prompt: prompt,
  tools: tools,
});

// Create agent executor
const agentExecutor = new AgentExecutor({
  agent: agent,
  tools: tools,
});

// Chat history
const chatHistory = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const askQuestion = () => {
  rl.question("User: ", async (input) => {
    const response = await agentExecutor.invoke(
      {
        input: input,
        chat_history: chatHistory,
      },
      { callbacks: [langfuseHandler] }
    );

    console.log("Agent: ", response.output);
    chatHistory.push(new HumanMessage(input));
    chatHistory.push(new AIMessage(response.output));
    askQuestion();
  });
};
askQuestion();

/* Things it can do:
  - Answer based on the trained data of Google and OpenAI
  - Using a search tools to look it up

*/
