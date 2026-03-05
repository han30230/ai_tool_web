import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "AI 툴 올인원 | 검색·비교·추천",
    template: "%s | AI 툴 올인원",
  },
  description:
    "모든 AI 툴을 한 곳에서. 수백 개의 AI 서비스를 카테고리·가격·기능으로 비교하고 업무에 맞는 AI 도구를 발견하세요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
