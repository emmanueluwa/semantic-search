//loading values and data to interact with apis
import { createPinecodeIndex, updatePinecone } from "@/utils";
import { indexName } from "@/config";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

export async function GET() {
  //getting all documents
  const loader = new DirectoryLoader("src/documents", {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();
  const vectorDimensions = 1536;

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  try {
    await createPinecodeIndex(client, indexName, vectorDimensions);
    await updatePinecone(client, indexName, docs);
  } catch (error) {
    console.log({ error });
  }

  return NextResponse.json({
    data: "successfully created index and loaded data to pinecone :)",
  });
}
