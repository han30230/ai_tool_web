import type { Tool } from "./types";
import { CATEGORIES } from "./categories";

import toolsData from "../data/tools.json";

/** Exclude placeholder/synthetic tools (e.g. "AI audio voice Tool 13"). */
function isPlaceholderName(name: string): boolean {
  return /^AI\s+.+\s+Tool\s+\d+$/i.test(name.trim());
}

const allTools: Tool[] = (toolsData as Tool[]).filter(
  (t) => t.name && !isPlaceholderName(t.name)
);

export { allTools as tools };

function toIsoDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseDateOnly(value?: string): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo, da));
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function daysBetweenUtc(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function hashToUnitInterval(input: string): number {
  // Stable, small hash → [0, 1)
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return allTools.find((t) => t.slug === slug);
}

/** All tool slugs (for sitemap, static paths). */
export function getToolSlugs(): string[] {
  return allTools.map((t) => t.slug);
}

/** Tools sorted by id desc (newest first). */
export function getNewestTools(limit = 12): Tool[] {
  return [...allTools].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, limit);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return allTools.filter((t) => t.category === categorySlug);
}

export function getFeaturedTools(): Tool[] {
  return allTools.filter((t) => t.featured);
}

/**
 * "Trending" heuristic (no analytics available):
 * - Favor recently updated tools (last_updated_at)
 * - Slight boost for featured tools
 * - Add a deterministic daily rotation to avoid feeling static
 */
export function getTrendingTools(limit = 12): Tool[] {
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const seed = toIsoDateOnly(todayUtc);

  const scored = allTools.map((t) => {
    const updated = parseDateOnly(t.last_updated_at) ?? parseDateOnly(t.pricing_last_updated_at);
    const daysSince = updated ? Math.max(0, daysBetweenUtc(updated, todayUtc)) : 9999;

    // Recency score: best within ~30 days, then decays.
    const recency = Math.max(0, 30 - Math.min(30, daysSince));
    const featuredBoost = t.featured ? 8 : 0;
    const rotation = hashToUnitInterval(`${seed}:${t.id}:${t.slug}`) * 3; // 0..3

    return { tool: t, score: recency + featuredBoost + rotation };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((x) => x.tool)
    .slice(0, limit);
}

/** Total number of tools (for "전체" pill). */
export function getTotalToolsCount(): number {
  return allTools.length;
}

/** Category list with actual tool counts (only categories that have tools). */
export function getCategoriesWithCount(): { slug: string; name: string; count: number }[] {
  const counts: Record<string, number> = {};
  allTools.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });
  return CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: counts[c.slug] || 0,
  })).filter((c) => c.count > 0);
}

export interface FilterOptions {
  category?: string;
  pricing?: string;
  korean_support?: boolean;
  tag?: string;
  search?: string;
  sort?: "featured" | "name" | "new";
}

export function filterTools(opts: FilterOptions): Tool[] {
  let list = [...allTools];
  if (opts.category) {
    list = list.filter((t) => t.category === opts.category);
  }
  if (opts.pricing) {
    list = list.filter((t) => t.pricing === opts.pricing);
  }
  if (opts.korean_support === true) {
    list = list.filter((t) => t.korean_support);
  }
  if (opts.tag) {
    list = list.filter((t) => t.tags.some((tag) => tag.toLowerCase().includes(opts.tag!.toLowerCase())));
  }
  if (opts.search) {
    const q = opts.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  if (opts.sort === "featured") {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } else if (opts.sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (opts.sort === "new") {
    list.sort((a, b) => Number(b.id) - Number(a.id));
  }
  return list;
}

/** Same category first, then by shared tags, so at least 6 when possible. */
export function getSimilarTools(tool: Tool, limit = 12): Tool[] {
  const sameCategory = allTools.filter(
    (t) => t.id !== tool.id && t.category === tool.category
  );
  if (sameCategory.length >= 6) return sameCategory.slice(0, limit);
  const tagSet = new Set(tool.tags.map((x) => x.toLowerCase()));
  const byTag = allTools.filter(
    (t) =>
      t.id !== tool.id &&
      !sameCategory.some((s) => s.id === t.id) &&
      t.tags.some((tag) => tagSet.has(tag.toLowerCase()))
  );
  const combined = [...sameCategory, ...byTag].slice(0, limit);
  return combined.length >= 6 ? combined : [...sameCategory, ...byTag, ...allTools]
    .filter((t) => t.id !== tool.id)
    .filter((t, i, a) => a.findIndex((x) => x.id === t.id) === i)
    .slice(0, limit);
}

/**
 * Extract root domain from website_url (path/query/trailing slash removed).
 * e.g. chat.openai.com → openai.com, gemini.google.com → google.com
 */
export function getDomainForLogo(websiteUrl: string): string {
  if (!websiteUrl?.trim()) return "";
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, "").toLowerCase();
    const parts = host.split(".");
    if (parts.length >= 3) {
      return parts.slice(-2).join(".");
    }
    return host;
  } catch {
    return "";
  }
}

/**
 * Single logo URL (first candidate). For backward compatibility.
 */
export function getLogoUrl(tool: Tool): string {
  const candidates = getLogoUrlCandidates(tool);
  return candidates[0] ?? "";
}

/**
 * 3-tier logo URL candidates (in order of use).
 * 1) DB logo_url
 * 2) Clearbit (size=128)
 * 3) Google favicon fallback
 * 4) Local placeholder (if exists at /placeholders/tool.png)
 * Empty/invalid entries are omitted.
 */
/** Append size to Clearbit URLs so we request smaller images (faster load). */
function clearbitWithSize(url: string, size = 128): string {
  const u = url.trim();
  if (!u.startsWith("https://logo.clearbit.com/")) return u;
  return u.includes("?") ? `${u}&size=${size}` : `${u}?size=${size}`;
}

export function getLogoUrlCandidates(tool: Tool): string[] {
  const out: string[] = [];
  const domain = getDomainForLogo(tool.website_url ?? "");

  if (tool.logo_url?.trim()) {
    out.push(clearbitWithSize(tool.logo_url));
  }
  if (domain) {
    out.push(`https://logo.clearbit.com/${domain}?size=128`);
    out.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  }

  return out;
}
