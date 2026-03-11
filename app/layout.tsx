import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getBaseUrl } from "@/lib/site";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

function getBaseUrlFromRequest(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return getBaseUrl();
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrlFromRequest();
  const ogImageAbs = `${baseUrl}/og-image.png`;
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "AI 툴 올인원 | AI 서비스 모음",
      template: "%s | AI 툴 올인원",
    },
    description:
      "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.",
    keywords: ["AI 툴", "AI 도구", "챗봇", "이미지 생성", "AI 비교", "AI 디렉토리", "ChatGPT", "Claude", "Gemini"],
    alternates: { canonical: baseUrl },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "AI 툴 올인원",
      url: baseUrl,
      title: "AI 툴 올인원 | AI 서비스 모음",
      description:
        "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.",
      images: [
        {
          url: ogImageAbs,
          type: "image/png",
          width: 1200,
          height: 630,
          alt: "AI 툴 올인원 | 500+ AI Tools Directory",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI 툴 올인원 | AI 서비스 모음",
      description:
        "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.",
      images: [ogImageAbs],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "180x180" }],
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI 툴 올인원",
  description: "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.",
  url: getBaseUrl(),
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", url: `${getBaseUrl()}/tools?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "스마트웰빙",
  url: getBaseUrl(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = getBaseUrlFromRequest();
  const jsonLdWebSiteWithBase = {
    ...jsonLdWebSite,
    url: baseUrl,
    potentialAction: {
      ...jsonLdWebSite.potentialAction,
      target: { "@type": "EntryPoint", url: `${baseUrl}/tools?q={search_term_string}` },
    },
  };
  const jsonLdOrgWithBase = { ...jsonLdOrg, url: baseUrl };

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://logo.clearbit.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSiteWithBase) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrgWithBase) }} />
        <Header />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <Footer />
        {/* Google Analytics (optional; only loads when NEXT_PUBLIC_GA_ID is set) */}
        <Analytics />
        {/* Vercel Analytics – page views and Web Vitals on every page */}
        <VercelAnalytics />
      </body>
    </html>
  );
}
