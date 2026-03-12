import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";
import { fetchNewsItems, getFallbackNews, NEWS_CATEGORIES, type NewsItem } from "@/lib/news";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string }> | { category?: string };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const base = getBaseUrl();
  const url = `${base}/${locale}/news`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: {
      title: `${t("title")} | ${tCommon("siteName")}`,
      description: t("metaDescription"),
      url,
      images: [
        {
          url: `${base}/og?kind=page&title=${encodeURIComponent(t("title"))}&subtitle=${encodeURIComponent(t("subtitle"))}&badge=News`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${t("title")} | ${tCommon("siteName")}`,
      description: t("metaDescription"),
      images: [`${base}/og?kind=page&title=${encodeURIComponent(t("title"))}&subtitle=${encodeURIComponent(t("subtitle"))}&badge=News`],
    },
  };
}

export const revalidate = 3600;

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const search = await Promise.resolve(searchParams || {});
  const category = search.category;
  let items: NewsItem[] = [];
  try {
    items = await fetchNewsItems(30, category);
  } catch (_) {
    items = getFallbackNews(category);
  }
  if (items.length === 0) items = getFallbackNews();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-slate-600">{t("subtitle")}</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">By topic</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            All
          </Link>
          {NEWS_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/news?category=${c.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium ${category === c.slug ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {items.map((n) => (
          <article
            key={n.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {n.source}
              </span>
              {n.category && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {NEWS_CATEGORIES.find((c) => c.slug === n.category)?.name ?? n.category}
                </span>
              )}
              <time dateTime={n.published_at} className="text-xs text-slate-500">
                {n.published_at}
              </time>
            </div>
            <h2 className="font-semibold text-slate-900">
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {n.title}
              </a>
            </h2>
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{n.summary}</p>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              aria-label="Read original"
            >
              Read original
              <span className="text-slate-400" aria-hidden>↗</span>
            </a>
          </article>
        ))}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("title"),
            description: t("subtitle"),
            numberOfItems: items.length,
            itemListElement: items.slice(0, 10).map((n, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "NewsArticle",
                headline: n.title,
                datePublished: n.published_at,
                author: { "@type": "Organization", name: n.source },
                url: n.url,
                description: n.summary,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
