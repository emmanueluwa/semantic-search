import { queryPineconeVectorStoreAndQueryLLM } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { indexName } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    const text = await queryPineconeVectorStoreAndQueryLLM(
      client,
      indexName,
      body
    );

    return NextResponse.json({
      data: text,
    });
  } catch (error) {
    console.log(error);
  }
}
