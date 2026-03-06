import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";
import { getFeaturedTools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "AI 툴 컬렉션",
  description: "업무별·테마별로 엄선한 AI 툴 모음.",
  alternates: { canonical: `${getBaseUrl()}/collections` },
};

export default function CollectionsPage() {
  const featured = getFeaturedTools().slice(0, 12);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI 툴 컬렉션</h1>
        <p className="mt-1 text-slate-600">업무별·테마별로 엄선한 AI 도구 모음입니다.</p>
      </div>
      <section>
        <h2 className="text-lg font-semibold text-slate-900">에디터 추천</h2>
        <p className="mt-0.5 text-sm text-slate-600">엄선한 인기·추천 툴</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
      <p className="text-sm text-slate-500">
        <Link href="/pricing/free" className="text-primary hover:underline">무료 AI 툴</Link>
        {" · "}
        <Link href="/tools" className="text-primary hover:underline">전체 목록</Link>
      </p>
    </div>
  );
}
