import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBaseUrl, CONTACT_EMAIL } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `${getBaseUrl()}/${locale}/contact` },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <p className="text-slate-600">{t("intro")}</p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">{t("email")}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        <p className="mt-3 text-xs text-slate-500">{t("replyNote")}</p>
      </div>
    </div>
  );
}
