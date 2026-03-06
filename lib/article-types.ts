export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  cover_image: string;
  published_at: string;
  read_time: number;
  featured: boolean;
}

export const ARTICLE_CATEGORIES = [
  { slug: "usage", name: "사용법" },
  { slug: "workflow", name: "워크플로우" },
  { slug: "prompt", name: "프롬프트" },
  { slug: "local-case", name: "국내 사례" },
  { slug: "productivity", name: "생산성" },
  { slug: "marketing", name: "마케팅" },
  { slug: "development", name: "개발" },
  { slug: "design", name: "디자인" },
] as const;
