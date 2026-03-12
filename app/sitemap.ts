import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getToolSlugs, tools as allTools } from "@/lib/tools";
import { getCategorySlugs } from "@/lib/categories";
import { getAllArticles, getArticleSlugs } from "@/lib/articles";
import { getTagKeys } from "@/lib/tags";

const LOCALES = ["ko", "en"];

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

  const staticPaths = [
    "",
    "/tools",
    "/articles",
    "/news",
    "/contact",
    "/privacy",
    "/terms",
    "/pricing/free",
    "/pricing/paid",
    "/pricing/freemium",
    "/collections",
  ];
  const staticPages: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      const url = path ? `${base}/${locale}${path}` : `${base}/${locale}`;
      const priority = path === "" ? 1 : path === "/tools" ? 0.9 : path === "/news" ? 0.7 : path === "/contact" ? 0.5 : path === "/privacy" || path === "/terms" ? 0.3 : 0.7;
      const changeFrequency = path === "/news" ? "hourly" as const : path === "" || path === "/tools" ? "daily" as const : path === "/contact" ? "monthly" as const : path === "/privacy" || path === "/terms" ? "yearly" as const : "weekly" as const;
      staticPages.push({ url, lastModified: today, changeFrequency, priority });
    }
  }

  const categorySlugs = getCategorySlugs();
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${base}/categories/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolSlugs = getToolSlugs();
  const toolPages: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const slug of toolSlugs) {
      toolPages.push({
        url: `${base}/${locale}/tools/${slug}`,
        lastModified: toolLastModifiedBySlug.get(slug) || today,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

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
