import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/site";
import { matchArticlesByTag, matchToolsByTag, getAllTags, normalizeTag, getRelatedTagKeys } from "@/lib/tags";
import { getCategoryBySlug } from "@/lib/categories";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumb } from "@/components/Breadcrumb";

function decodeParam(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeParam(tag);
  const key = normalizeTag(decoded);
  const tagInfo = getAllTags().find((t) => t.key === key);
  if (!tagInfo) return { title: "태그를 찾을 수 없음" };
  const canonical = `${getBaseUrl()}/tags/${encodeURIComponent(tagInfo.key)}`;
  const ogImage = `${getBaseUrl()}/og?kind=page&title=${encodeURIComponent(`#${tagInfo.label}`)}&subtitle=${encodeURIComponent(
    `관련 툴 ${tagInfo.toolCount}개 · 관련 글 ${tagInfo.articleCount}개`
  )}&badge=${encodeURIComponent("Tag")}`;
  return {
    title: `#${tagInfo.label} 관련 AI 툴·글 | AI 툴 올인원`,
    description: `#${tagInfo.label} 태그의 AI 툴 ${tagInfo.toolCount}개와 AI 관련 글 ${tagInfo.articleCount}개를 한 페이지에서 확인하세요.`,
    alternates: { canonical },
    openGraph: {
      title: `#${tagInfo.label} | AI 툴 올인원`,
      description: `관련 툴 ${tagInfo.toolCount}개 · 관련 글 ${tagInfo.articleCount}개`,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `#${tagInfo.label}` }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `#${tagInfo.label} | AI 툴 올인원`,
      description: `관련 툴 ${tagInfo.toolCount}개 · 관련 글 ${tagInfo.articleCount}개`,
      images: [ogImage],
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeParam(tag);
  const key = normalizeTag(decoded);
  const tagInfo = getAllTags().find((t) => t.key === key);
  if (!tagInfo) notFound();

  const tools = matchToolsByTag(tagInfo.key);
  const articles = matchArticlesByTag(tagInfo.key).sort((a, b) => (b.published_at > a.published_at ? 1 : -1));
  const relatedTagKeys = getRelatedTagKeys(tagInfo.key, 12);
  const relatedTags = relatedTagKeys
    .map((k) => getAllTags().find((t) => t.key === k))
    .filter(Boolean)
    .slice(0, 12) as NonNullable<ReturnType<typeof getAllTags>[number]>[];

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/tags/${encodeURIComponent(tagInfo.key)}`;
  const badgeLabel = `#${tagInfo.label}`;

  const categoryCounts = new Map<string, number>();
  for (const t of tools) {
    const c = t.category;
    categoryCounts.set(c, (categoryCounts.get(c) || 0) + 1);
  }
  const topCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([slug, count]) => ({ slug, count, name: getCategoryBySlug(slug)?.name || slug }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: badgeLabel,
    url,
    about: tagInfo.label,
    mainEntity: [
      ...tools.slice(0, 20).map((t) => ({
        "@type": "SoftwareApplication",
        name: t.name,
        url: `${baseUrl}/tools/${t.slug}`,
      })),
      ...articles.slice(0, 20).map((a) => ({
        "@type": "Article",
        headline: a.title,
        url: `${baseUrl}/articles/${a.slug}`,
        datePublished: a.published_at,
      })),
    ],
  };

  const faqItems = [
    {
      q: `${badgeLabel} 태그는 어떤 의미인가요?`,
      a: `${badgeLabel}는 툴/글에 공통으로 붙는 주제 태그입니다. 같은 태그를 가진 툴과 글을 한 번에 묶어 보여줘서, 빠르게 비교·학습할 수 있게 돕습니다.`,
    },
    {
      q: `${badgeLabel} 관련 툴은 어떻게 고르면 좋나요?`,
      a: `목표(예: 생산성/코딩/이미지), 예산(무료/유료), 한국어 지원 여부를 먼저 정한 뒤, 기능(주요 Features)과 사용 사례(Use Cases)를 비교해 고르는 것을 추천합니다.`,
    },
    {
      q: `이 페이지는 자동으로 업데이트되나요?`,
      a: `네. 툴/글 데이터에 새로운 태그가 추가되면, 해당 태그 허브에서 자동으로 집계되어 노출됩니다.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "AI 툴 모음", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: badgeLabel, item: url },
    ],
  };

  const relatedTagsJsonLd = relatedTags.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${badgeLabel} 연관 태그`,
        itemListElement: relatedTags.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CollectionPage",
            name: `#${t.label}`,
            url: `${baseUrl}/tags/${encodeURIComponent(t.key)}`,
          },
        })),
      }
    : null;

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "태그", href: "/tools" },
    { label: `#${tagInfo.label}` },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{badgeLabel}</h1>
        <p className="text-slate-600">
          관련 툴 <span className="font-semibold">{tools.length}</span>개 · 관련 글{" "}
          <span className="font-semibold">{articles.length}</span>개
        </p>
        <p className="text-sm text-slate-500">
          이 태그 페이지는 같은 주제의 툴과 글을 한 곳에 모아 비교·학습할 수 있도록 구성되었습니다.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href="/tools" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
            AI 툴 전체 보기 →
          </Link>
          <Link href="/articles" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
            AI 관련 글 전체 보기 →
          </Link>
        </div>
      </header>

      {topCategories.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">이 태그에서 많이 찾는 카테고리</h2>
          <div className="mt-3 h-px bg-slate-200" />
          <div className="mt-4 flex flex-wrap gap-2">
            {topCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                {c.name} <span className="ml-1 text-xs text-primary/80">({c.count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedTags.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">연관 태그</h2>
          <div className="mt-3 h-px bg-slate-200" />
          <p className="mt-3 text-sm text-slate-600">
            비슷한 주제의 태그도 함께 보면 더 빨리 원하는 툴을 찾을 수 있어요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedTags.map((t) => (
              <Link
                key={t.key}
                href={`/tags/${encodeURIComponent(t.key)}`}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                #{t.label}
                <span className="ml-1 text-xs text-slate-500">({t.toolCount + t.articleCount})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tools.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">관련 AI 툴</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 12).map((t, i) => (
              <ToolCard key={t.id} tool={t} priority={i < 6} />
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">관련 AI 관련 글</h2>
          <ul className="mt-3 space-y-2">
            {articles.slice(0, 12).map((a) => (
              <li key={a.id} className="flex items-baseline justify-between gap-3">
                <Link href={`/articles/${a.slug}`} className="font-medium text-slate-900 hover:text-primary">
                  {a.title}
                </Link>
                <span className="shrink-0 text-xs text-slate-500">{a.published_at}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(tools.length === 0 && articles.length === 0) && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          이 태그로 연결된 툴/글이 아직 없습니다.
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">자주 묻는 질문 (FAQ)</h2>
        <div className="mt-3 h-px bg-slate-200" />
        <div className="mt-4 space-y-3">
          {faqItems.map((f) => (
            <details key={f.q} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <summary className="cursor-pointer font-medium text-slate-900">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {relatedTagsJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedTagsJsonLd) }} />
      ) : null}
    </div>
  );
}

