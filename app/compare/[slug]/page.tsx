import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools";
import { getCategoryBySlug } from "@/lib/categories";
import { ToolLogo } from "@/components/ToolLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getShortDescription, getFeatures, getPricingPlans } from "@/lib/tool-detail";

/** Parse "chatgpt-vs-claude" -> ["chatgpt", "claude"] */
function parseCompareSlug(slug: string): [string, string] | null {
  const lower = slug.toLowerCase();
  if (!lower.includes("-vs-")) return null;
  const [a, b] = lower.split("-vs-").map((s) => s.trim());
  if (!a || !b) return null;
  return [a, b];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseCompareSlug(slug);
  if (!parsed) return { title: "AI 툴 비교" };
  const [slugA, slugB] = parsed;
  const toolA = getToolBySlug(slugA);
  const toolB = getToolBySlug(slugB);
  if (!toolA || !toolB) return { title: "AI 툴 비교" };
  const title = `${toolA.name} vs ${toolB.name} 비교`;
  const description = `${toolA.name}와(과) ${toolB.name} 비교. 기능, 가격, 특징을 한눈에 확인하세요.`;
  const canonical = `${getBaseUrl()}/compare/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} | AI 툴 올인원`, description, url: canonical },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseCompareSlug(slug);
  if (!parsed) notFound();
  const [slugA, slugB] = parsed;
  const toolA = getToolBySlug(slugA);
  const toolB = getToolBySlug(slugB);
  if (!toolA || !toolB) notFound();

  const catA = getCategoryBySlug(toolA.category);
  const catB = getCategoryBySlug(toolB.category);
  const featuresA = getFeatures(toolA);
  const featuresB = getFeatures(toolB);
  const plansA = getPricingPlans(toolA);
  const plansB = getPricingPlans(toolB);
  const shortA = getShortDescription(toolA);
  const shortB = getShortDescription(toolB);

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "AI 서비스 모음", href: "/tools" },
    { label: `${toolA.name} vs ${toolB.name}` },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{toolA.name} vs {toolB.name}</h1>
        <p className="mt-1 text-slate-600">두 서비스를 나란히 비교해 보세요.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ToolLogo tool={toolA} size={48} className="rounded-lg" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{toolA.name}</h2>
              {catA && <span className="text-sm text-slate-500">{catA.name}</span>}
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">{shortA}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{toolA.pricing}</span>
            {toolA.korean_support && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">한국어</span>}
          </div>
          <a href={toolA.website_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            공식 사이트
          </a>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-800">주요 기능</h3>
            <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
              {featuresA.slice(0, 5).map((f, i) => (
                <li key={i}>· {f}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-slate-800">가격</h3>
            <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
              {plansA.map((p, i) => (
                <li key={i}>{p.name}: {p.price}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ToolLogo tool={toolB} size={48} className="rounded-lg" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{toolB.name}</h2>
              {catB && <span className="text-sm text-slate-500">{catB.name}</span>}
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">{shortB}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{toolB.pricing}</span>
            {toolB.korean_support && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">한국어</span>}
          </div>
          <a href={toolB.website_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            공식 사이트
          </a>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-800">주요 기능</h3>
            <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
              {featuresB.slice(0, 5).map((f, i) => (
                <li key={i}>· {f}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-slate-800">가격</h3>
            <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
              {plansB.map((p, i) => (
                <li key={i}>{p.name}: {p.price}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        <Link href={`/tools/${toolA.slug}`} className="text-primary hover:underline">{toolA.name} 상세</Link>
        {" · "}
        <Link href={`/tools/${toolB.slug}`} className="text-primary hover:underline">{toolB.name} 상세</Link>
        {" · "}
        <Link href={`/compare?tools=${toolA.slug},${toolB.slug}`} className="text-primary hover:underline">여러 툴로 더 비교하기</Link>
        {" · "}
        <Link href={`/alternatives/${toolA.slug}`} className="text-primary hover:underline">{toolA.name} 대안 더 보기</Link>
      </p>
    </div>
  );
}
