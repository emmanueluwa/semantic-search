import { queryPineconeVectorStoreAndQueryLLM } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { indexName } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "No body provided" }, { status: 400 });
    }

    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
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
    return NextResponse.json(
      {
        error: "Error processing query",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
