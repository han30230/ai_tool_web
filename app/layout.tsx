import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getBaseUrl } from "@/lib/site";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "AI 툴 올인원 | 검색·비교·추천",
    template: "%s | AI 툴 올인원",
  },
  description:
    "모든 AI 툴을 한 곳에서. 실제 서비스 중인 AI를 카테고리·가격·기능으로 비교하고 업무에 맞는 AI 도구를 발견하세요.",
  keywords: ["AI 툴", "AI 도구", "챗봇", "이미지 생성", "AI 비교", "AI 디렉토리", "ChatGPT", "Claude", "Gemini"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "AI 툴 올인원",
    title: "AI 툴 올인원 | 검색·비교·추천",
    description: "실제 서비스 중인 AI를 카테고리·가격·기능으로 비교하고 업무에 맞는 AI 도구를 발견하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 툴 올인원 | 검색·비교·추천",
    description: "실제 서비스 중인 AI를 비교하고 발견하세요.",
  },
  alternates: { canonical: getBaseUrl() },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "180x180" }],
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI 툴 올인원",
  description: "AI 툴 검색·비교·추천 서비스",
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
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <Header />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
