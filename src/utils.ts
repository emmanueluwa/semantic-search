import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { timeout } from "./config";
import { loadQAStuffChain } from "langchain/chains";
import { OpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

export const createPinecodeIndex = async (
  client,
  indexName,
  vectorDimension
) => {
  console.log(`Checking ${indexName} ... :)`);

  const existingIndexes = await client.listIndexes();

  const indexExists = existingIndexes.indexes.some(
    (index) => index.name === indexName
  );

  if (!indexExists) {
    console.log(`Creating ${indexName} ... :)`);

    await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
      waitUntilReady: true,
    });

    console.log(
      `Creating index ... please wait for it to finish initializing :)`
    );

    await new Promise((resolve) => setTimeout(resolve, timeout));
  } else {
    console.log(`index ${indexName} already exists :)`);
  }
};

export const updatePinecone = async (client, indexName, docs) => {
  console.log("getting pinecone index!");
  const index = client.index(indexName);

  console.log(`Pinecone index retrieved... ${indexName}`);

  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);

    const textPath = doc.metadata.source;

    const text = doc.pageContent;

    //recursive character text splitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks");

    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);

    console.log(
      `calling openai embedding endpoint with ${chunks.length} text chunks :)`
    );

    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );

    console.log("finished embedding documents");

    console.log(
      `Creating ${chunks.length} vectors array with id, values and metadata :)`
    );

    //upload data to pinecone
    const batchSize = 100;
    let batch: any = [];

    for (let batch_index = 0; batch_index < chunks.length; batch_index++) {
      const chunk = chunks[batch_index];

      const vector = {
        id: `${textPath}_${batch_index}`,
        values: embeddingsArrays[batch_index],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          textPath: textPath,
        },
      };
      batch = [...batch, vector];

      //check batchsize
      if (batch.length === batchSize || batch_index === chunks.length - 1) {
        await index.upsert(batch);
        batch = [];
      }
    }
    console.log(`Pinecone index updated with ${chunks.length} vectors`);
  }
};

export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question
) => {
  console.log("Querying pinecone vector store...");

  const index = client.Index(indexName);

  //query pinecone index and return top 10 matches
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  let queryResponse = await index.query({
    queryRequest: {
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });

  console.log(`Found ${queryResponse.matches.length} matches :)`);

  console.log(`Asking question: ${question}...`);

  if (queryResponse.matches.length) {
    const llm = new OpenAI({});

    const chain = loadQAStuffChain(llm);

    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");

    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });

    console.log(`Answer :) : ${result.text}`);

    return result.text;
  } else {
    console.log("no matches, GPT-3 not needed :)");
  }
};
