import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site";
import { tools } from "@/lib/tools";
import { CompareToolPage } from "@/components/CompareToolPage";

export const metadata: Metadata = {
  title: "AI 툴 비교 | 가격·기능 한눈에",
  description: "여러 AI 툴을 선택하고 가격, 무료 플랜, 주요 기능, API 제공 여부 등을 표로 비교해 보세요.",
  alternates: { canonical: `${getBaseUrl()}/compare` },
  openGraph: { title: "AI 툴 비교 | AI 툴 올인원", description: "여러 AI 툴을 표로 비교해 보세요." },
};

export default function CompareIndexPage() {
  return <CompareToolPage tools={tools} />;
}

