import { Suspense } from "react";
import Link from "next/link";
import { getFeaturedTools, getCategoriesWithCount } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { BusinessInfo } from "@/components/BusinessInfo";

export default function HomePage() {
  const featured = getFeaturedTools();
  const categoriesWithCount = getCategoriesWithCount();
  const displayTools = featured.slice(0, 12);

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          모든 AI 툴을 한 곳에서
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 leading-relaxed">
          수백 개의 AI 서비스를 카테고리·가격·기능으로 비교하고
          <br className="hidden sm:block" />
          업무에 딱 맞는 AI 도구를 쉽게 발견하세요.
        </p>
        <div className="mt-6">
          <SearchBar placeholder="AI 툴 이름, 태그, 카테고리로 검색..." />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          카테고리
        </h2>
        <div className="mt-3">
          <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100" />}>
            <CategoryPills categoriesWithCount={categoriesWithCount} />
          </Suspense>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">이번주 인기 툴</h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-primary hover:underline"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        {displayTools.length === 0 && (
          <p className="py-8 text-center text-slate-500">등록된 추천 툴이 없습니다.</p>
        )}
      </section>

      <BusinessInfo />
    </div>
  );
}
