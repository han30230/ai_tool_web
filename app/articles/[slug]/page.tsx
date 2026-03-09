import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/site";
import { getArticleBySlug, getCategoryName, getLatestArticles } from "@/lib/articles";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArticleCardImage } from "@/components/ArticleCardImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = typeof slug === "string" ? decodeURIComponent(slug) : slug;
  const article = getArticleBySlug(normalizedSlug);
  if (!article) return { title: "글을 찾을 수 없음" };
  const canonical = `${getBaseUrl()}/articles/${normalizedSlug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: `${article.title} | AI 툴 올인원`,
      description: article.excerpt,
      url: canonical,
      type: "article",
      publishedTime: article.published_at,
      images: article.cover_image ? [{ url: article.cover_image, alt: article.title }] : undefined,
    },
    twitter: { card: "summary_large_image" as const, title: article.title, description: article.excerpt },
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      nodes.push(<h2 key={key++} className="mt-6 text-xl font-bold text-slate-900">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      nodes.push(<h3 key={key++} className="mt-4 text-lg font-semibold text-slate-800">{line.slice(4)}</h3>);
    } else if (line.trim()) {
      nodes.push(<p key={key++} className="mt-2 text-slate-600 leading-relaxed">{line}</p>);
    }
  }
  return <div className="prose prose-slate max-w-none">{nodes}</div>;
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = typeof slug === "string" ? decodeURIComponent(slug) : slug;
  const article = getArticleBySlug(normalizedSlug);
  if (!article) notFound();

  const related = getLatestArticles(4).filter((a) => a.slug !== slug);
  const catName = getCategoryName(article.category);
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "AI 관련 글", href: "/articles" },
    { label: article.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    image: article.cover_image,
    author: { "@type": "Organization", name: "AI 툴 올인원" },
    publisher: { "@type": "Organization", name: "AI 툴 올인원", url: getBaseUrl() },
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      <article>
        <header>
          <span className="text-sm font-medium text-primary">{catName}</span>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{article.title}</h1>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
            <time dateTime={article.published_at}>{article.published_at}</time>
            <span>{article.read_time}분 읽기</span>
          </div>
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
            <ArticleCardImage
              src={article.cover_image}
              alt={article.title}
              fallbackKey={article.slug}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 672px"
            />
          </div>
        </header>
        <div className="mt-6">{renderContent(article.content)}</div>
        {article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Link key={t} href={`/articles?category=${article.category}`} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200">
                #{t}
              </Link>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">다른 글</h2>
          <ul className="mt-3 space-y-2">
            {related.map((a) => (
              <li key={a.id}>
                <Link href={`/articles/${a.slug}`} className="text-primary hover:underline">{a.title}</Link>
                <span className="ml-2 text-xs text-slate-500">{a.published_at}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
