import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";
import { filterTools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumb } from "@/components/Breadcrumb";

const TIERS: Record<string, { title: string; description: string; pricingFilter: string }> = {
  free: { title: "Free AI Tools", description: "AI tools you can use for free.", pricingFilter: "무료" },
  freemium: { title: "Free + Paid AI Tools", description: "AI tools with free and paid plans.", pricingFilter: "무료+유료" },
  paid: { title: "Paid AI Tools", description: "Subscription-based AI tools.", pricingFilter: "유료" },
};

type Props = { params: Promise<{ locale: string; tier: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tier } = await params;
  const t = TIERS[tier];
  if (!t) return { title: "Pricing" };
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `${getBaseUrl()}/${locale}/pricing/${tier}` },
  };
}

export default async function PricingTierPage({ params }: Props) {
  const { locale, tier } = await params;
  setRequestLocale(locale);
  const config = TIERS[tier];
  if (!config) notFound();

  const tools = filterTools({ pricing: config.pricingFilter, sort: "featured" });
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "AI Tools", href: "/tools" },
    { label: config.title },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
        <p className="mt-1 text-slate-600">{config.description}</p>
        <p className="mt-1 text-sm text-slate-500">{tools.length} tools</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/pricing/free" className={`rounded-full px-4 py-2 text-sm font-medium ${tier === "free" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Free</Link>
        <Link href="/pricing/freemium" className={`rounded-full px-4 py-2 text-sm font-medium ${tier === "freemium" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Freemium</Link>
        <Link href="/pricing/paid" className={`rounded-full px-4 py-2 text-sm font-medium ${tier === "paid" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Paid</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      {tools.length === 0 && <p className="py-12 text-center text-slate-500">No tools in this tier.</p>}
    </div>
  );
}
