import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getSimilarTools } from "@/lib/tools";
import { getCategoryBySlug } from "@/lib/categories";
import { getBaseUrl } from "@/lib/site";
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
  const ogImage = getFirstScreenshotOrPlaceholder(tool);
  const canonical = `${getBaseUrl()}/tools/${slug}`;
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

  const baseUrl = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.website_url,
    applicationCategory: category?.name,
    image: getFirstScreenshotOrPlaceholder(tool),
    offers: {
      "@type": "Offer",
      price: tool.pricing === "무료" ? "0" : undefined,
      priceCurrency: "KRW",
    },
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

  const toolUrl = `${baseUrl}/tools/${tool.slug}`;
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
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <ToolLogo tool={tool} size={80} className="rounded-xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 text-slate-600">{shortDesc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
                {tool.pricing}
              </span>
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
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <ShareButtons url={toolUrl} title={`${tool.name} | AI 툴 올인원`} description={shortDesc} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark"
              >
                공식 사이트 방문
              </a>
              <button
                type="button"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                북마크
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* 1. Overview (full description) */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <div className="mt-3 h-px bg-slate-200" />
            <p className="mt-3 text-slate-600 leading-relaxed">{tool.description}</p>
            <DataDisclaimer />
          </section>

          {/* 2. Key Features */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
            <div className="mt-3 h-px bg-slate-200" />
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
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              가격 자세히 보기 →
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

          {/* 6. Similar Tools */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Similar Tools</h2>
              <div className="flex gap-3">
                <Link href={`/alternatives/${tool.slug}`} className="text-sm font-medium text-primary hover:underline">
                  {tool.name} 대안 더 보기
                </Link>
                <Link href="/tools" className="text-sm font-medium text-primary hover:underline">
                  전체 비교
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
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h3 className="font-semibold text-slate-900">공식 사이트</h3>
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-lg bg-primary px-4 py-2.5 text-center font-medium text-white hover:bg-primary-dark"
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
    </div>
  );
}
