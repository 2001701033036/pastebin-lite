import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const h = req.headers.get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const key = `paste:${params.id}`;
    const paste: any = await kv.get(key);

    if (!paste) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = getNow(req);

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
      await kv.set(key, paste);
    }

    return NextResponse.json({
      content: paste.content,
      remaining_views: paste.remainingViews,
      expires_at: paste.expiresAt
        ? new Date(paste.expiresAt).toISOString()
        : null,
    });
  } catch (err) {
    console.error("GET paste error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
