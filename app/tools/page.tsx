import { Suspense } from "react";
import type { Metadata } from "next";
import { filterTools, getCategoriesWithCount } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { ToolsFilter } from "@/components/ToolsFilter";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 36;

export const metadata: Metadata = {
  title: "AI 툴 모음 | 검색·비교·추천",
  description:
    "500개 이상의 AI 도구를 카테고리·가격·기능으로 필터하고 비교하세요. 챗봇, 이미지 생성, 코딩, 마케팅 등.",
  openGraph: {
    title: "AI 툴 모음 | AI 툴 올인원",
    description: "500개 이상의 AI 도구를 검색하고 비교하세요.",
  },
};

type SearchParams = { category?: string; pricing?: string; korean?: string; tag?: string; q?: string; sort?: string; page?: string };

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const params: SearchParams = await Promise.resolve(searchParams);
  const category = params.category ?? undefined;
  const pricing = params.pricing ?? undefined;
  const koreanOnly = params.korean === "1";
  const tag = params.tag ?? undefined;
  const search = params.q ?? undefined;
  const sort = (params.sort as "featured" | "name" | "new") ?? "featured";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const filtered = filterTools({
    category,
    pricing: pricing || undefined,
    korean_support: koreanOnly || undefined,
    tag,
    search,
    sort,
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageTools = filtered.slice(start, start + PAGE_SIZE);
  const categoriesWithCount = getCategoriesWithCount();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI 서비스 모음</h1>
        <p className="mt-1 text-slate-600">
          {filtered.length}개의 AI 툴을 카테고리·가격·기능으로 필터하고 비교하세요.
        </p>
      </div>

      <SearchBar placeholder="툴 이름, 태그로 검색..." />

      <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100 w-full max-w-2xl" />}>
        <CategoryPills categoriesWithCount={categoriesWithCount} />
      </Suspense>

      <ToolsFilter
        current={{ category, pricing, korean: koreanOnly, tag, search, sort }}
        categoriesWithCount={categoriesWithCount}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {pageTools.length === 0 && (
        <p className="py-12 text-center text-slate-500">조건에 맞는 툴이 없습니다.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/tools"
          searchParams={params}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "AI 툴 목록",
            description: "AI 도구 검색 및 비교 디렉토리",
            numberOfItems: filtered.length,
            itemListElement: pageTools.slice(0, 20).map((t, i) => ({
              "@type": "ListItem",
              position: start + i + 1,
              item: {
                "@type": "SoftwareApplication",
                name: t.name,
                url: t.website_url,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
