import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Terms of Use",
    description: "Terms of use for AI Tools Hub.",
    alternates: { canonical: `${getBaseUrl()}/${locale}/terms` },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-bold text-slate-900">Terms of Use</h1>
      <p className="text-sm text-slate-500">Last updated: January 2025</p>
      <div className="mt-6 space-y-4 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-800">1. Purpose</h2>
          <p>These terms govern your use of AI Tools Hub (the &quot;Service&quot;).</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">2. Service</h2>
          <p>The Service provides AI tool search, comparison, and recommendations. Information is based on public sources; actual policies are set by each provider.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">3. Your obligations</h2>
          <p>You must use the Service in compliance with applicable laws and must not infringe others&apos; rights or disrupt the Service.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">4. Disclaimer</h2>
          <p>We do not guarantee the accuracy of tool information. Use of third-party sites and services is at your own risk.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">5. Contact</h2>
          <p>For questions about these terms, use our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.</p>
        </section>
      </div>
    </div>
  );
}
