import type { Tool } from "./types";
import { CATEGORIES } from "./categories";

import toolsData from "../data/tools.json";

const allTools: Tool[] = toolsData as Tool[];

export { allTools as tools };

export function getToolBySlug(slug: string): Tool | undefined {
  return allTools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return allTools.filter((t) => t.category === categorySlug);
}

export function getFeaturedTools(): Tool[] {
  return allTools.filter((t) => t.featured);
}

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
export function getLogoUrlCandidates(tool: Tool): string[] {
  const out: string[] = [];
  const domain = getDomainForLogo(tool.website_url ?? "");

  if (tool.logo_url?.trim()) {
    out.push(tool.logo_url.trim());
  }
  if (domain) {
    out.push(`https://logo.clearbit.com/${domain}?size=128`);
    out.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  }

  return out;
}
