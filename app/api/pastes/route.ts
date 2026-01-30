import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();

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
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
