/**
 * API route: GET /api/ai-news
 * Returns latest AI news from trusted RSS feeds. Cached for 30 minutes.
 */

import { NextResponse } from "next/server";
import { fetchAINews } from "@/lib/aiNewsFetcher";

export const dynamic = "force-dynamic";
export const revalidate = 1800; // 30 minutes

export async function GET() {
  try {
    const items = await fetchAINews(20);
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[api/ai-news]", err);
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
}
