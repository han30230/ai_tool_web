import type { Article } from "./article-types";
import articlesData from "../data/articles.json";

const articles: Article[] = articlesData as Article[];

export function getAllArticles(): Article[] {
  return [...articles];
}

export function getArticleBySlug(slug: string): Article | undefined {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch (_) {}
  return articles.find((a) => a.slug === decoded || a.slug === slug);
}

export function getFeaturedArticles(limit = 6): Article[] {
  return articles.filter((a) => a.featured).slice(0, limit);
}

export function getLatestArticles(limit = 12): Article[] {
  return [...articles].sort((a, b) => (b.published_at > a.published_at ? 1 : -1)).slice(0, limit);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}

export function getCategoryName(slug: string): string {
  const map: Record<string, string> = {
    usage: "사용법",
    workflow: "워크플로우",
    prompt: "프롬프트",
    "local-case": "국내 사례",
    productivity: "생산성",
    marketing: "마케팅",
    development: "개발",
    design: "디자인",
  };
  return map[slug] || slug;
}
