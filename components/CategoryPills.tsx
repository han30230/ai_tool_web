"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

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
  "data-analytics",
  "research",
  "education",
  "automation",
  "no-code",
  "3d-gaming",
  "business",
  "translation",
  "presentation",
  "social-media",
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
  "data-analytics": "데이터",
  research: "리서치",
  education: "교육",
  automation: "자동화",
  "no-code": "노코드",
  "3d-gaming": "3D",
  business: "비즈니스",
  translation: "번역",
  presentation: "프레젠테이션",
  "social-media": "소셜",
};

interface CategoryWithCount {
  slug: string;
  name: string;
  count: number;
}

interface CategoryPillsProps {
  categoriesWithCount: CategoryWithCount[];
  /** Total tool count for "전체" pill. */
  totalCount?: number;
}

export function CategoryPills({ categoriesWithCount, totalCount }: CategoryPillsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const countBySlug = Object.fromEntries(categoriesWithCount.map((c) => [c.slug, c.count]));
  const currentCategory = pathname.startsWith("/categories/")
    ? pathname.replace("/categories/", "").split("/")[0]
    : searchParams.get("category") ?? null;
  const total = totalCount ?? Object.values(countBySlug).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/tools"
        className={`rounded-full px-4 py-2.5 min-h-[44px] inline-flex items-center text-sm font-medium transition touch-manipulation ${
          !currentCategory
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
        }`}
      >
        전체
        <span className="ml-1 opacity-70">({total})</span>
      </Link>
      {PILL_ORDER.filter((slug) => (countBySlug[slug] || 0) > 0).map((slug) => {
        const count = countBySlug[slug] || 0;
        const label = PILL_LABELS[slug] || slug;
        const isActive = currentCategory === slug;
        return (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className={`rounded-full px-4 py-2.5 min-h-[44px] inline-flex items-center text-sm font-medium transition touch-manipulation ${
              isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
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
