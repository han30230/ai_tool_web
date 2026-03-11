import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";
import { ArticleCardImage } from "@/components/ArticleCardImage";
import { getFeaturedArticles, getLatestArticles, getCategoryName } from "@/lib/articles";
import { ARTICLE_CATEGORIES } from "@/lib/article-types";

export const metadata: Metadata = {
  title: "AI 관련 글",
  description: "AI 툴 사용법, 워크플로, 프롬프트 템플릿, 국내 사례. ChatGPT·Claude·이미지 생성 등 활용 가이드.",
  keywords: ["AI 글", "사용법", "워크플로우", "프롬프트", "국내 사례", "마케팅", "개발"],
  alternates: { canonical: `${getBaseUrl()}/articles` },
  openGraph: {
    title: "AI 관련 글 | AI 툴 올인원",
    description: "AI 툴 사용법·워크플로·프롬프트·국내 사례.",
    url: `${getBaseUrl()}/articles`,
    images: [
      {
        url: `${getBaseUrl()}/og?kind=page&title=${encodeURIComponent("AI 관련 글")}&subtitle=${encodeURIComponent(
          "사용법·워크플로·프롬프트·국내 사례"
        )}&badge=${encodeURIComponent("Articles")}`,
        width: 1200,
        height: 630,
        alt: "AI 관련 글",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "AI 관련 글 | AI 툴 올인원",
    description: "사용법·워크플로·프롬프트·국내 사례까지 정리했습니다.",
    images: [`${getBaseUrl()}/og?kind=page&title=${encodeURIComponent("AI 관련 글")}&subtitle=${encodeURIComponent("사용법·워크플로·프롬프트·국내 사례")}&badge=${encodeURIComponent("Articles")}`],
  },
};

type Props = { searchParams?: Promise<{ category?: string }> | { category?: string } };

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams || {});
  const category = params.category;
  const featured = getFeaturedArticles(6);
  const allLatest = getLatestArticles(50);
  const latest = category
    ? allLatest.filter((a) => a.category === category)
    : allLatest.slice(0, 24);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI 관련 글</h1>
        <p className="mt-1 text-slate-600">
          사용법·워크플로·프롬프트·국내 사례까지. AI 툴 활용 가이드와 추천 정리합니다.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">에디터 추천</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((a) => (
            <ArticleCard key={a.id} article={a} featured />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">카테고리</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ARTICLE_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/articles?category=${c.slug}`}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">최신 글</h2>
        {latest.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            이 카테고리에 해당하는 글이 없습니다. <Link href="/articles" className="text-primary hover:underline">전체 글 보기</Link>
          </p>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "AI 관련 글",
            description: "AI 툴 사용법, 워크플로, 프롬프트, 국내 사례",
            numberOfItems: latest.length,
            itemListElement: latest.slice(0, 10).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Article",
                name: a.title,
                url: `${getBaseUrl()}/articles/${a.slug}`,
                datePublished: a.published_at,
              },
            })),
          }),
        }}
      />
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
}: {
  article: { slug: string; title: string; excerpt: string; category: string; published_at: string; read_time: number; cover_image: string };
  featured?: boolean;
}) {
  const catName = getCategoryName(article.category);
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      {article.cover_image ? (
        <div className="relative aspect-video w-full bg-slate-100">
          <ArticleCardImage
            src={article.cover_image}
            fallbackKey={article.slug}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes={featured ? "(max-width:1024px) 50vw, 33vw" : "33vw"}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-primary">{catName}</span>
        <h3 className="mt-1 font-semibold text-slate-900 line-clamp-2 group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span>{article.published_at}</span>
          <span>{article.read_time}분 읽기</span>
        </div>
      </div>
    </Link>
  );
}
