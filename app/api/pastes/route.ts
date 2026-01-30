import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  const { content, ttl_seconds, max_views } = await req.json();

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const id = nanoid(8);
  const now = Date.now();

  const paste = {
    content,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    remainingViews: max_views ?? null,
    createdAt: now,
  };

  await redis.set(`paste:${id}`, paste);

  return NextResponse.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
