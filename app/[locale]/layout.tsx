import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

function getBaseUrlFromRequest(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return getBaseUrl();
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const baseUrl = getBaseUrl();
  return {
    metadataBase: new URL(baseUrl),
    title: { default: `${t("siteName")} | AI 서비스 모음`, template: `%s | ${t("siteName")}` },
    description: t("metaDescription"),
    alternates: { canonical: baseUrl },
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      siteName: t("siteName"),
      url: baseUrl,
      title: t("siteName"),
      description: t("metaDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const baseUrl = getBaseUrlFromRequest();
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI 툴 올인원",
    description:
      "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", url: `${baseUrl}/tools?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "스마트웰빙",
    url: baseUrl,
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <Header />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <Footer />
      <Analytics />
      <VercelAnalytics />
    </NextIntlClientProvider>
  );
}
