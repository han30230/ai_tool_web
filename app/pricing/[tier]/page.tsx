import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/site";
import { filterTools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumb } from "@/components/Breadcrumb";

const TIERS: Record<string, { title: string; description: string; pricingFilter: string }> = {
  free: { title: "무료 AI 툴", description: "무료로 사용할 수 있는 AI 도구 목록입니다.", pricingFilter: "무료" },
  freemium: { title: "무료+유료 AI 툴", description: "무료 플랜과 유료 플랜을 함께 제공하는 AI 도구입니다.", pricingFilter: "무료+유료" },
  paid: { title: "유료 AI 툴", description: "유료 구독 기반 AI 도구 목록입니다.", pricingFilter: "유료" },
};

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }): Promise<Metadata> {
  const { tier } = await params;
  const t = TIERS[tier];
  if (!t) return { title: "가격별 AI 툴" };
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `${getBaseUrl()}/pricing/${tier}` },
  };
}

export default async function PricingTierPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  const config = TIERS[tier];
  if (!config) notFound();

  const tools = filterTools({ pricing: config.pricingFilter, sort: "featured" });
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "AI 서비스 모음", href: "/tools" },
    { label: config.title },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
        <p className="mt-1 text-slate-600">{config.description}</p>
        <p className="mt-1 text-sm text-slate-500">총 {tools.length}개</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/pricing/free" className={`rounded-full px-4 py-2 text-sm font-medium ${tier === "free" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>무료</Link>
        <Link href="/pricing/freemium" className={`rounded-full px-4 py-2 text-sm font-medium ${tier === "freemium" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>무료+유료</Link>
        <Link href="/pricing/paid" className={`rounded-full px-4 py-2 text-sm font-medium ${tier === "paid" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>유료</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      {tools.length === 0 && <p className="py-12 text-center text-slate-500">해당 가격대의 툴이 없습니다.</p>}
    </div>
  );
}
