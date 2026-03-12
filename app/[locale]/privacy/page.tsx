import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBaseUrl } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Privacy Policy",
    description: "Privacy policy for AI Tools Hub.",
    alternates: { canonical: `${getBaseUrl()}/${locale}/privacy` },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-1 text-sm text-slate-500">Last updated: January 2025</p>
      <div className="mt-6 space-y-5 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-800">1. Information we collect</h2>
          <p>We may collect minimal information such as email (when you subscribe) and access logs.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">2. Use of information</h2>
          <p>Collected information is used only for service improvement, newsletter delivery, and support.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">3. Retention</h2>
          <p>We retain data only as long as necessary; where required by law, we keep it for the required period.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">4. Contact</h2>
          <p>For privacy inquiries, please use our <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.</p>
        </section>
      </div>
    </div>
  );
}
