import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

type Params = {
  params: {
    id: string;
  };
};

export async function GET(
  req: Request,
  { params }: Params
) {
  const key = `paste:${params.id}`;
  const paste: any = await redis.get(key);

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = Date.now();

  if (paste.expiresAt && now >= paste.expiresAt) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.remainingViews !== null) {
    if (paste.remainingViews <= 0) {
      return NextResponse.json(
        { error: "View limit exceeded" },
        { status: 404 }
      );
    }

    paste.remainingViews -= 1;
    await redis.set(key, paste);
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remainingViews,
  });
}
