"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResultUrl("");

    const body: any = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (views) body.max_views = Number(views);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setViews("");
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Pastebin Lite
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            placeholder="Enter your text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
            required
          />

          <input
            type="number"
            placeholder="TTL in seconds (optional)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Max views (optional)"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
            Create Paste
          </button>
        </form>

        {resultUrl && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg break-all">
            <p className="font-semibold mb-1">Share this link:</p>
            <a
              href={resultUrl}
              className="text-blue-700 underline"
            >
              {resultUrl}
            </a>
          </div>
        )}

        {error && (
          <p className="mt-3 text-red-600 text-sm">{error}</p>
        )}
      </div>
    </main>
  );
}
