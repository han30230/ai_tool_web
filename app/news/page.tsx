import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";
import { fetchNewsItems, getFallbackNews, NEWS_CATEGORIES, type NewsItem } from "@/lib/news";

export const metadata: Metadata = {
  title: "AI 소식",
  description: "AI 업계 뉴스, 툴 업데이트, 릴리즈 소식. OpenAI, Google AI, Anthropic, AI 스타트업·투자·정책까지 한국어로 정리합니다.",
  keywords: ["AI 뉴스", "AI 소식", "OpenAI", "Google AI", "Anthropic", "AI 정책", "AI 투자"],
  alternates: { canonical: `${getBaseUrl()}/news` },
  openGraph: {
    title: "AI 소식 | AI 툴 올인원",
    description: "AI 업계 뉴스와 툴 업데이트를 한국어로 전달합니다.",
    url: `${getBaseUrl()}/news`,
  },
};

export const revalidate = 3600;

type Props = { searchParams?: Promise<{ category?: string }> | { category?: string } };

export default async function NewsPage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams || {});
  const category = params.category;
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
        <h1 className="text-2xl font-bold text-slate-900">AI 소식</h1>
        <p className="mt-1 text-slate-600">
          AI 업계 뉴스, 툴 업데이트, 릴리즈 소식을 한국어로 정리했습니다. 주제별로 필터할 수 있습니다.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">주제별 보기</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            전체
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
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {n.title}
              </a>
            </h2>
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{n.summary}</p>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              aria-label="원문 보기"
            >
              원문 보기
              <span className="text-slate-400" aria-hidden>
                ↗
              </span>
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
            name: "AI 소식",
            description: "AI 업계 뉴스와 툴 업데이트",
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
