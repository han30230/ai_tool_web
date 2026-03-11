import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getToolSlugs, tools as allTools } from "@/lib/tools";
import { getCategorySlugs } from "@/lib/categories";
import { getAllArticles, getArticleSlugs } from "@/lib/articles";
import { getTagKeys } from "@/lib/tags";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const today = new Date();

  const toolLastModifiedBySlug = new Map<string, Date>();
  for (const t of allTools) {
    const v = (t.last_updated_at || "").trim();
    const d = v ? new Date(`${v}T00:00:00.000Z`) : null;
    toolLastModifiedBySlug.set(t.slug, d && !Number.isNaN(d.getTime()) ? d : today);
  }

  const articleLastModifiedBySlug = new Map<string, Date>();
  for (const a of getAllArticles()) {
    const v = (a.published_at || "").trim();
    const d = v ? new Date(`${v}T00:00:00.000Z`) : null;
    articleLastModifiedBySlug.set(a.slug, d && !Number.isNaN(d.getTime()) ? d : today);
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: today, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, lastModified: today, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/articles`, lastModified: today, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/news`, lastModified: today, changeFrequency: "hourly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: today, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: today, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: today, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/pricing/free`, lastModified: today, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing/paid`, lastModified: today, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing/freemium`, lastModified: today, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections`, lastModified: today, changeFrequency: "weekly", priority: 0.7 },
  ];

  const categorySlugs = getCategorySlugs();
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${base}/categories/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolSlugs = getToolSlugs();
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${base}/tools/${slug}`,
    lastModified: toolLastModifiedBySlug.get(slug) || today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleSlugs = getArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${base}/articles/${encodeURIComponent(slug)}`,
    lastModified: articleLastModifiedBySlug.get(slug) || today,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tagKeys = getTagKeys();
  const tagPages: MetadataRoute.Sitemap = tagKeys.map((key) => ({
    url: `${base}/tags/${encodeURIComponent(key)}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...articlePages, ...tagPages];
}
