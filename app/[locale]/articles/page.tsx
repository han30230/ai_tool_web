import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";
import { ArticleCardImage } from "@/components/ArticleCardImage";
import { getFeaturedArticles, getLatestArticles, getCategoryName } from "@/lib/articles";
import { ARTICLE_CATEGORIES } from "@/lib/article-types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string }> | { category?: string };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const base = getBaseUrl();
  const url = `${base}/${locale}/articles`;

  return {
    title: t("title"),
    description: t("metaDescription"),
    keywords: ["AI 글", "사용법", "워크플로우", "프롬프트", "국내 사례", "마케팅", "개발"],
    alternates: { canonical: url },
    openGraph: {
      title: `${t("title")} | ${tCommon("siteName")}`,
      description: t("metaDescription"),
      url,
      images: [
        {
          url: `${base}/og?kind=page&title=${encodeURIComponent(t("title"))}&subtitle=${encodeURIComponent(
            t("subtitle")
          )}&badge=${encodeURIComponent("Articles")}`,
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
      images: [
        `${base}/og?kind=page&title=${encodeURIComponent(t("title"))}&subtitle=${encodeURIComponent(t("subtitle"))}&badge=${encodeURIComponent(
          "Articles"
        )}`,
      ],
    },
  };
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");
  const tCommon = await getTranslations("common");

  const query = await Promise.resolve(searchParams || {});
  const category = query.category;
  const featured = getFeaturedArticles(6);
  const allLatest = getLatestArticles(50);
  const latest = category ? allLatest.filter((a) => a.category === category) : allLatest.slice(0, 24);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-slate-600">{t("subtitle")}</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Editor's pick</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((a) => (
            <ArticleCard key={a.id} article={a} featured />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
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
        <h2 className="text-lg font-semibold text-slate-900">Latest</h2>
        {latest.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            {t("noArticlesInCategory")}{" "}
            <Link href="/articles" className="text-primary hover:underline">
              {tCommon("viewAll")}
            </Link>
          </p>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("title"),
            description: t("subtitle"),
            numberOfItems: latest.length,
            itemListElement: latest.slice(0, 10).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Article",
                name: a.title,
                url: `${getBaseUrl()}/${locale}/articles/${a.slug}`,
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
  article: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    published_at: string;
    read_time: number;
    cover_image: string;
  };
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
        <h3 className="mt-1 font-semibold text-slate-900 line-clamp-2 group-hover:text-primary">{article.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span>{article.published_at}</span>
          <span>{article.read_time}분 읽기</span>
        </div>
      </div>
    </Link>
  );
}
