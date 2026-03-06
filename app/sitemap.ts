import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getToolSlugs } from "@/lib/tools";
import { getCategorySlugs } from "@/lib/categories";
import { getArticleSlugs } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/pricing/free`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing/paid`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing/freemium`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  const categorySlugs = getCategorySlugs();
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${base}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolSlugs = getToolSlugs();
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${base}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleSlugs = getArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${base}/articles/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...articlePages];
}
