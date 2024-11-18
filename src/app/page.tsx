"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch("/api/setup", {
        method: "GET",
      });

      const json = await result.json();
      console.log("result: ", json);
    } catch (error) {
      console.log({ error });
    }
  }

  async function sendQuery() {
    try {
      if (!query) return;

      setResult("");
      setLoading(true);

      const result = await fetch("/api/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });

      const json = await result.json();

      setResult(json.data);
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <input
        className="text-black px-2 py-1"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2"
        onClick={sendQuery}
      >
        Ask a Question
      </button>

      {loading && <p>Asking...</p>}

      {result && <p>{result}</p>}

      <button
        className="bg-sky-500 p-4 rounded-xl font-bold"
        onClick={createIndexAndEmbeddings}
      >
        Create index and embeddings
      </button>
    </div>
  );
}
