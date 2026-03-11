/**
 * AI News Aggregator — Fetches and normalizes RSS from trusted AI sources.
 * Used by /api/ai-news and can be called server-side with caching.
 */

import Parser from "rss-parser";

/** Normalized AI news item for UI consumption. */
export type AINewsItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
};

/** RSS feed config: URL and display name. */
const AI_NEWS_FEEDS: { url: string; source: string }[] = [
  { url: "https://openai.com/news/rss.xml", source: "OpenAI" },
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch AI" },
  { url: "https://deepmind.google/blog/rss.xml", source: "DeepMind" },
  { url: "https://arxiv.org/rss/cs.AI", source: "arXiv AI" },
];

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "AI-Tool-Directory/1.0 (RSS Aggregator)" },
});

/** Strip HTML tags and decode common entities. */
function stripHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  let s = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
  };
  Object.entries(entities).forEach(([k, v]) => {
    s = s.split(k).join(v);
  });
  return s.slice(0, 400);
}

/** Parse one feed and return normalized items. */
async function fetchFeed(url: string, source: string): Promise<AINewsItem[]> {
  const res = await fetch(url, {
    next: { revalidate: 1800 },
    headers: { "User-Agent": "AI-Tool-Directory/1.0 (RSS Aggregator)" },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  let feed: Parser.Output<Parser.Item>;
  try {
    feed = await parser.parseString(xml);
  } catch {
    return [];
  }
  const items: AINewsItem[] = [];
  for (const item of feed.items || []) {
    const link = item.link?.trim() || item.guid?.trim();
    const title = (item.title || "").trim();
    if (!link || !title) continue;
    let publishedAt = "";
    try {
      publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
    } catch {
      publishedAt = new Date().toISOString();
    }
    const summary = stripHtml(item.contentSnippet || item.content || item.summary || title);
    items.push({
      title: title.slice(0, 300),
      link,
      source,
      publishedAt,
      summary: summary || title.slice(0, 200),
    });
  }
  return items;
}

/**
 * Fetch all configured RSS feeds, normalize, dedupe by link, sort by date, return latest N.
 * Failures per feed are ignored; partial results are returned.
 */
export async function fetchAINews(limit = 20): Promise<AINewsItem[]> {
  const all: AINewsItem[] = [];
  const results = await Promise.allSettled(
    AI_NEWS_FEEDS.map(({ url, source }) => fetchFeed(url, source))
  );
  for (const result of results) {
    if (result.status === "fulfilled") all.push(...result.value);
  }
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = item.link.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  deduped.sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  return deduped.slice(0, limit);
}
