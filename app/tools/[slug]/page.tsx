import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getSimilarTools } from "@/lib/tools";
import { getCategoryBySlug } from "@/lib/categories";
import { getBaseUrl } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";
import { normalizeTag } from "@/lib/tags";
import {
  getFeatures,
  getUseCases,
  getPros,
  getCons,
  getShortDescription,
  getLastUpdatedAt,
  getPricingPlans,
  getFirstScreenshotOrPlaceholder,
} from "@/lib/tool-detail";
import { ToolLogo } from "@/components/ToolLogo";
import { ToolCard } from "@/components/ToolCard";
import { SubscribeCTA } from "@/components/SubscribeCTA";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ShareButtons } from "@/components/ShareButtons";
import { DataDisclaimer } from "@/components/DataDisclaimer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "툴을 찾을 수 없음" };
  const canonical = `${getBaseUrl()}/tools/${slug}`;
  const ogImage = `${getBaseUrl()}/og?kind=tool&title=${encodeURIComponent(tool.name)}&subtitle=${encodeURIComponent(
    tool.short_description || tool.description
  )}&badge=${encodeURIComponent("AI 툴")}`;
  return {
    title: `${tool.name} 사용법·가격·대안 | AI 툴 올인원`,
    description: tool.description,
    keywords: [tool.name, "AI", "대안", "비교", ...tool.tags],
    alternates: { canonical },
    openGraph: {
      title: `${tool.name} | AI 툴 올인원`,
      description: tool.description,
      type: "website",
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: { card: "summary_large_image", title: `${tool.name} | AI 툴 올인원`, description: tool.description },
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategoryBySlug(tool.category);
  const similar = getSimilarTools(tool, 12);
  const features = getFeatures(tool);
  const useCases = getUseCases(tool);
  const pros = getPros(tool);
  const cons = getCons(tool);
  const shortDesc = getShortDescription(tool);
  const lastUpdated = getLastUpdatedAt(tool);
  const pricingPlans = getPricingPlans(tool);
  const pricingUrl = tool.pricing_url || tool.website_url;
  const pricingNote = tool.pricing_note;
  const pricingUpdatedAt = tool.pricing_last_updated_at;
  const startingPrice = pricingPlans.find((p) => !/무료|Free|\$0\b|₩0\b/i.test(p.price))?.price;

  const baseUrl = getBaseUrl();
  const toolPageUrl = `${baseUrl}/tools/${tool.slug}`;

  const toolTagSet = new Set((tool.tags || []).map((t) => t.toLowerCase()));
  const relatedArticles = getAllArticles()
    .filter((a) => {
      const titleHit = (a.title || "").toLowerCase().includes(tool.name.toLowerCase());
      const tagHit = (a.tags || []).some((t) => toolTagSet.has(String(t).toLowerCase()));
      return titleHit || tagHit;
    })
    .sort((a, b) => (b.published_at > a.published_at ? 1 : -1))
    .slice(0, 6);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: toolPageUrl,
    applicationCategory: category?.name,
    image: getFirstScreenshotOrPlaceholder(tool),
    offers: {
      "@type": "Offer",
      price: tool.pricing === "무료" ? "0" : undefined,
      priceCurrency: "KRW",
    },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${tool.name}는 어떤 툴인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: (tool.short_description || tool.description || "").split(/\n\n+/)[0]?.trim() || `${tool.name} 소개 페이지입니다.`,
        },
      },
      {
        "@type": "Question",
        name: `${tool.name}는 무료인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `요금제는 \"${tool.pricing}\"입니다. 플랜별 한도·가격은 공식 가격 페이지에서 확인하세요.`,
        },
      },
      {
        "@type": "Question",
        name: `${tool.name}는 어떤 기능이 핵심인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `대표 기능: ${features.slice(0, 5).join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `${tool.name}는 어떤 상황에서 쓰면 좋나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `추천 사용 사례: ${useCases.slice(0, 4).join(" / ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `${tool.name} 공식 사이트는 어디인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `공식 사이트: ${tool.website_url}`,
        },
      },
    ],
  };
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "AI 서비스 모음", item: `${baseUrl}/tools` },
      ...(category ? [{ "@type": "ListItem" as const, position: 3, name: category.name, item: `${baseUrl}/categories/${tool.category}` }] : []),
      { "@type": "ListItem" as const, position: category ? 4 : 3, name: tool.name, item: `${baseUrl}/tools/${tool.slug}` },
    ],
  };

  const toolUrl = toolPageUrl;
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "AI 서비스 모음", href: "/tools" },
    ...(category ? [{ label: category.name, href: `/categories/${tool.category}` }] : []),
    { label: tool.name },
  ];

  return (
    <div className="min-h-screen">
      <Breadcrumb items={breadcrumbItems} />
      {/* 1. Overview (Hero) */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <ToolLogo tool={tool} size={80} className="rounded-xl shrink-0" priority />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">{tool.name}</h1>
            <p className="mt-1 text-slate-600">{shortDesc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
                {tool.pricing}
              </span>
              {startingPrice && (
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                  {startingPrice}부터
                </span>
              )}
              {tool.korean_support && (
                <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-medium text-emerald-700">
                  한국어 지원
                </span>
              )}
              {category && (
                <Link
                  href={`/categories/${tool.category}`}
                  className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  {category.name}
                </Link>
              )}
              <span className="rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                최근 업데이트: {lastUpdated}
              </span>
            </div>
            {tool.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tool.tags.slice(0, 10).map((t) => (
                  <Link
                    key={t}
                    href={`/tags/${encodeURIComponent(normalizeTag(String(t)))}`}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <ShareButtons url={toolUrl} title={`${tool.name} | AI 툴 올인원`} description={shortDesc} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 min-h-[44px] font-medium text-white hover:bg-primary-dark active:opacity-90 touch-manipulation"
              >
                공식 사이트 방문
              </a>
              <Link
                href={`/compare?add=${encodeURIComponent(tool.slug)}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 min-h-[44px] font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
              >
                비교에 추가
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 min-h-[44px] font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
              >
                북마크
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="space-y-6 sm:space-y-8 lg:col-span-2">
          {/* 1. Overview (full description, supports multiple paragraphs) */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <div className="mt-3 h-px bg-slate-200" />
            <div className="mt-3 space-y-3 text-slate-600 leading-relaxed">
              {tool.description.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
            <DataDisclaimer />
          </section>

          {/* 2. Key Features */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Key Features</h2>
            <div className="mt-3 h-px bg-slate-200" />
            <ul className="mt-3 space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Use Cases */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Use Cases</h2>
            <div className="mt-3 h-px bg-slate-200" />
            <p className="mt-3 text-sm text-slate-500">이럴 때 쓰면 좋아요</p>
            <ul className="mt-2 space-y-2">
              {useCases.map((uc, i) => (
                <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {uc}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Pricing */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
            <div className="mt-3 h-px bg-slate-200" />
            {pricingPlans.length > 0 ? (
              <>
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3 py-2 text-left font-medium text-slate-700">플랜</th>
                        <th className="px-3 py-2 text-left font-medium text-slate-700">가격</th>
                        <th className="hidden px-3 py-2 text-left font-medium text-slate-700 sm:table-cell">설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingPlans.map((plan, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-medium text-slate-800">{plan.name}</td>
                          <td className="px-3 py-2 text-slate-600">{plan.price}</td>
                          <td className="hidden px-3 py-2 text-slate-500 sm:table-cell">{plan.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(pricingUpdatedAt || pricingNote) && (
                  <p className="mt-3 text-xs text-slate-500">
                    {pricingUpdatedAt ? `가격 확인일: ${pricingUpdatedAt}` : null}
                    {pricingUpdatedAt && pricingNote ? " · " : null}
                    {pricingNote ? pricingNote : null}
                  </p>
                )}
              </>
            ) : (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                현재 이 툴의 <span className="font-semibold">플랜별 가격 정보가 아직 정리되지 않았습니다</span>. 아래 버튼에서 공식 가격 페이지를 확인해 주세요.
              </div>
            )}
            <a
              href={pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              공식 가격 페이지 보기 →
            </a>
          </section>

          {/* 5. Pros & Cons */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Pros</h2>
              <div className="mt-3 h-px bg-slate-200" />
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {pros.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-500">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Cons</h2>
              <div className="mt-3 h-px bg-slate-200" />
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {cons.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-500">−</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 5.5 Related Articles (internal links for SEO) */}
          {relatedArticles.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">관련 AI 관련 글</h2>
                <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
                  글 전체 보기 →
                </Link>
              </div>
              <div className="mt-3 h-px bg-slate-200" />
              <p className="mt-3 text-sm text-slate-600">
                {tool.name}와(과) 함께 보면 좋은 글을 모았습니다.
              </p>
              <ul className="mt-3 space-y-2">
                {relatedArticles.map((a) => (
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

          {/* 6. Similar Tools */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Similar Tools</h2>
              <div className="flex gap-3">
                <Link href={`/alternatives/${tool.slug}`} className="text-sm font-medium text-primary hover:underline">
                  {tool.name} 대안 더 보기
                </Link>
                <Link href="/compare" className="text-sm font-medium text-primary hover:underline">
                  비교 페이지
                </Link>
              </div>
            </div>
            <div className="mt-3 h-px bg-slate-200" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {similar.slice(0, 8).map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar: 8. Official CTA + Subscribe */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm lg:sticky lg:top-24">
            <h3 className="font-semibold text-slate-900">공식 사이트</h3>
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-lg bg-primary px-4 py-3 min-h-[44px] flex items-center justify-center text-center font-medium text-white hover:bg-primary-dark active:opacity-90 touch-manipulation"
            >
              방문하기
            </a>
            <div className="mt-5 border-t border-slate-100 pt-5">
              <SubscribeCTA />
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {relatedArticles.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${tool.name} 관련 글`,
              itemListElement: relatedArticles.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Article",
                  headline: a.title,
                  url: `${baseUrl}/articles/${a.slug}`,
                  datePublished: a.published_at,
                },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
