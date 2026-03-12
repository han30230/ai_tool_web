import { Suspense } from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";
import { filterTools, getCategoriesWithCount, getTotalToolsCount } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { ToolsFilter } from "@/components/ToolsFilter";
import { Pagination } from "@/components/Pagination";
import { getAllTags } from "@/lib/tags";

const PAGE_SIZE = 36;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams> | SearchParams;
};
type SearchParams = { category?: string; pricing?: string; korean?: string; tag?: string; q?: string; sort?: string; page?: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const base = getBaseUrl();
  const url = `${base}/${locale}/tools`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: {
      title: `${t("metaTitle")} | ${tCommon("siteName")}`,
      description: t("metaDescription"),
      url,
      images: [
        {
          url: `${base}/og?kind=page&title=${encodeURIComponent(t("title"))}&subtitle=${encodeURIComponent(t("searchCompare"))}&badge=Tools`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${t("metaTitle")} | ${tCommon("siteName")}`,
      description: t("metaDescription"),
      images: [`${base}/og?kind=page&title=${encodeURIComponent(t("title"))}&subtitle=${encodeURIComponent(t("searchCompare"))}&badge=Tools`],
    },
  };
}

export default async function ToolsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tools");
  const tCommon = await getTranslations("common");

  const search = await Promise.resolve(searchParams);
  const category = search.category ?? undefined;
  const pricing = search.pricing ?? undefined;
  const koreanOnly = search.korean === "1";
  const tag = search.tag ?? undefined;
  const searchQ = search.q ?? undefined;
  const sort = (search.sort as "featured" | "name" | "new") ?? "featured";
  const page = Math.max(1, parseInt(search.page || "1", 10));

  const filtered = filterTools({
    category,
    pricing: pricing || undefined,
    korean_support: koreanOnly || undefined,
    tag,
    search: searchQ,
    sort,
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageTools = filtered.slice(start, start + PAGE_SIZE);
  const categoriesWithCount = getCategoriesWithCount();
  const totalCount = getTotalToolsCount();
  const popularTags = getAllTags().slice(0, 18);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{t("title")}</h1>
        <p className="mt-1 text-slate-600 text-sm sm:text-base">
          {t("toolsCount", { count: filtered.length })}
        </p>
      </div>

      <SearchBar placeholder={tCommon("searchPlaceholder")} />

      {popularTags.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{t("popularTags")}</h2>
            <span className="text-xs text-slate-500">{t("popularTagsDesc")}</span>
          </div>
          <div className="mt-3 h-px bg-slate-200" />
          <div className="mt-4 flex flex-wrap gap-2">
            {popularTags.map((tagItem) => (
              <Link
                key={tagItem.key}
                href={`/tags/${encodeURIComponent(tagItem.key)}`}
                className="rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                #{tagItem.label} <span className="ml-1 text-xs text-primary/80">({tagItem.toolCount + tagItem.articleCount})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100 w-full max-w-2xl" />}>
        <CategoryPills categoriesWithCount={categoriesWithCount} totalCount={totalCount} />
      </Suspense>

      <ToolsFilter
        current={{ category, pricing, korean: koreanOnly, tag, search: searchQ, sort }}
        categoriesWithCount={categoriesWithCount}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageTools.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} priority={i < 6} />
        ))}
      </div>

      {pageTools.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center">
          <p className="text-slate-600">{t("noTools")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("noToolsHint")}</p>
          <Link href="/tools" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            {t("viewAllTools")}
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/tools"
          searchParams={search}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("title"),
            numberOfItems: filtered.length,
            itemListElement: pageTools.slice(0, 20).map((tool, i) => ({
              "@type": "ListItem",
              position: start + i + 1,
              item: {
                "@type": "SoftwareApplication",
                name: tool.name,
                url: `${getBaseUrl()}/${locale}/tools/${tool.slug}`,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
