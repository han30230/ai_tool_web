import { Suspense } from "react";
import Link from "next/link";
import { getTrendingTools, getCategoriesWithCount, getTotalToolsCount, getNewestTools } from "@/lib/tools";
import { getLatestArticles } from "@/lib/articles";
import { fetchNewsItems, getFallbackNews } from "@/lib/news";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { BusinessInfo } from "@/components/BusinessInfo";
import { SubscribeCTA } from "@/components/SubscribeCTA";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { AINewsSection } from "@/components/AINewsSection";
import { getBaseUrl } from "@/lib/site";

export default async function HomePage() {
  const trending = getTrendingTools(12);
  const newest = getNewestTools(8);
  const categoriesWithCount = getCategoriesWithCount();
  const totalCount = getTotalToolsCount();
  const latestArticles = getLatestArticles(6);
  let newsItems: Awaited<ReturnType<typeof fetchNewsItems>> = [];
  try {
    newsItems = await fetchNewsItems(6);
  } catch (_) {
    newsItems = getFallbackNews().slice(0, 6);
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="text-center px-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          모든 AI 툴을 한 곳에서
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 leading-relaxed text-base sm:text-[inherit]">
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
            <CategoryPills categoriesWithCount={categoriesWithCount} totalCount={totalCount} />
          </Suspense>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">🔥 급상승 AI 툴</h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.slice(0, 12).map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} priority={i < 6} />
          ))}
        </div>
        {trending.length === 0 && (
          <p className="py-8 text-center text-slate-500">등록된 추천 툴이 없습니다.</p>
        )}
      </section>

      {newest.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">🆕 신규 추가된 AI 툴</h2>
            <Link href="/tools?sort=new" className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation">전체 보기 →</Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} priority={i < 4} />
            ))}
          </div>
        </section>
      )}

      {latestArticles.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">최신 AI 관련 글</h2>
            <Link href="/articles" className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation">전체 보기 →</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {latestArticles.map((a) => (
              <li key={a.id}>
                <Link href={`/articles/${a.slug}`} className="font-medium text-slate-900 hover:text-primary block py-1.5 -mx-1 px-1 rounded-lg hover:bg-slate-100 touch-manipulation">{a.title}</Link>
                <span className="ml-2 text-xs text-slate-500">{a.published_at} · {a.read_time}분</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {newsItems.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">최신 AI 소식</h2>
            <Link href="/news" className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation">전체 보기 →</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {newsItems.map((n) => (
              <li key={n.id} className="flex flex-wrap items-baseline gap-2 py-1">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">{n.source}</span>
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-900 hover:text-primary break-words touch-manipulation">{n.title}</a>
                <span className="text-xs text-slate-500">{n.published_at}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <AINewsSection />
      </section>

      <section>
        <SubscribeCTA />
      </section>

      <DataDisclaimer />

      <BusinessInfo />
    </div>
  );
}
