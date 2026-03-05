"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const PILL_ORDER = [
  "chatbot-llm",
  "image-generation",
  "video-generation",
  "audio-voice",
  "writing",
  "coding",
  "design",
  "marketing",
  "seo",
  "productivity",
  "automation",
  "education",
  "business",
];

const PILL_LABELS: Record<string, string> = {
  "chatbot-llm": "챗봇",
  "image-generation": "이미지",
  "video-generation": "영상",
  "audio-voice": "오디오",
  writing: "글쓰기",
  coding: "코딩",
  design: "디자인",
  marketing: "마케팅",
  seo: "SEO",
  productivity: "생산성",
  automation: "자동화",
  education: "교육",
  business: "비즈니스",
};

interface CategoryWithCount {
  slug: string;
  name: string;
  count: number;
}

interface CategoryPillsProps {
  categoriesWithCount: CategoryWithCount[];
}

export function CategoryPills({ categoriesWithCount }: CategoryPillsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const countBySlug = Object.fromEntries(categoriesWithCount.map((c) => [c.slug, c.count]));
  const currentCategory = pathname.startsWith("/categories/")
    ? pathname.replace("/categories/", "").split("/")[0]
    : searchParams.get("category") ?? null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <Link
        href="/tools"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          !currentCategory
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        전체
      </Link>
      {PILL_ORDER.filter((slug) => (countBySlug[slug] || 0) > 0).map((slug) => {
        const count = countBySlug[slug] || 0;
        const label = PILL_LABELS[slug] || slug;
        const isActive = currentCategory === slug;
        return (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
            <span className="ml-1 opacity-70">({count})</span>
          </Link>
        );
      })}
    </div>
  );
}
