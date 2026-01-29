import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
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

    // 
    //await kv.set(`paste:${id}`, paste);
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
