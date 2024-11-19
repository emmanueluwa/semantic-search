"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Database,
  AlertCircle,
  FileText,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDescriptionVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-white">
      <div
        className={`w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden mb-8 transition-all duration-500 ease-in-out ${
          isDescriptionVisible ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        }`}
      >
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-center text-white">
            Solana Whitepaper AI Assistant
          </h1>
          <p className="text-center text-gray-200">
            This AI-enabled Semantic Search app utilizes Langchain, Pinecone
            Vector Database, OpenAI ChatGPT, and Next.js to provide intelligent
            responses based on the Solana whitepaper PDF.
          </p>
          <div className="flex items-center justify-center text-blue-300">
            <FileText className="mr-2 h-5 w-5" />
            <span className="font-semibold">Powered by Solana Whitepaper</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
        className="mb-4 text-blue-300 hover:text-blue-100 transition-colors duration-200"
      >
        {isDescriptionVisible ? "Hide" : "Show"} Description{" "}
        <ChevronDown
          className={`inline-block transition-transform duration-200 ${
            isDescriptionVisible ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="relative">
            <input
              className="w-full px-4 py-3 pl-12 text-white bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none placeholder-white/50"
              placeholder="Ask about Solana..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuery()}
              disabled={loading}
            />
            <Search className="absolute left-3 top-3 h-6 w-6 text-white/50" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={sendQuery}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              <span>Ask Question</span>
            </button>

            <button
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={createIndexAndEmbeddings}
              disabled={loading}
            >
              <Database className="h-5 w-5 mr-2" />
              <span>Create Index</span>
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-white/20 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-200">Response:</h3>
              <p className="text-white whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10">
          <p className="text-center text-sm text-gray-300">
            Enter your question and press Enter or click &quot;Ask
            Question&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
