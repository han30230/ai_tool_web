import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

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
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 leading-relaxed text-base sm:text-[inherit]">
          {t("heroSubtitle").split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br className="hidden sm:block" />}
              {line}
            </span>
          ))}
        </p>
        <div className="mt-6">
          <SearchBar placeholder={tCommon("searchPlaceholder")} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t("categories")}
        </h2>
        <div className="mt-3">
          <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100" />}>
            <CategoryPills categoriesWithCount={categoriesWithCount} totalCount={totalCount} />
          </Suspense>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{t("trendingTitle")}</h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation"
          >
            {tCommon("viewAll")}
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.slice(0, 12).map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} priority={i < 6} />
          ))}
        </div>
        {trending.length === 0 && (
          <p className="py-8 text-center text-slate-500">{tCommon("noResults")}</p>
        )}
      </section>

      {newest.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{t("newestTitle")}</h2>
            <Link href="/tools?sort=new" className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation">
              {tCommon("viewAll")}
            </Link>
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
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{t("articlesTitle")}</h2>
            <Link href="/articles" className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation">
              {tCommon("viewAll")}
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {latestArticles.map((a) => (
              <li key={a.id}>
                <Link href={`/articles/${a.slug}`} className="font-medium text-slate-900 hover:text-primary block py-1.5 -mx-1 px-1 rounded-lg hover:bg-slate-100 touch-manipulation">
                  {a.title}
                </Link>
                <span className="ml-2 text-xs text-slate-500">{a.published_at} · {a.read_time}{tCommon("minRead")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {newsItems.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{t("newsTitle")}</h2>
            <Link href="/news" className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation">
              {tCommon("viewAll")}
            </Link>
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
