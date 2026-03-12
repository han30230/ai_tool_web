import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";
import { getFeaturedTools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = getBaseUrl();
  return {
    title: "AI Tools Collection",
    description: "Curated AI tools by use case and theme.",
    alternates: { canonical: `${base}/${locale}/collections` },
  };
}

export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const featured = getFeaturedTools().slice(0, 12);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Tools Collection</h1>
        <p className="mt-1 text-slate-600">Curated AI tools by use case and theme.</p>
      </div>
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Editor&apos;s pick</h2>
        <p className="mt-0.5 text-sm text-slate-600">Featured and recommended tools</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
      <p className="text-sm text-slate-500">
        <Link href="/pricing/free" className="text-primary hover:underline">Free AI tools</Link>
        {" · "}
        <Link href="/tools" className="text-primary hover:underline">All tools</Link>
      </p>
    </div>
  );
}
