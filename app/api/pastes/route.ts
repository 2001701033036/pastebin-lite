import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const id = nanoid(8);
    const now = Date.now();
    const expiresAt = ttl_seconds ? now + ttl_seconds * 1000 : null;

    const paste = {
      content,
      expiresAt,
      remainingViews: max_views ?? null,
      createdAt: now,
    };

    await redis.set(`paste:${id}`, paste);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
