import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/site";
import { getToolBySlug, getSimilarTools } from "@/lib/tools";
import { getCategoryBySlug } from "@/lib/categories";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumb } from "@/components/Breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "대안 툴" };
  const title = `${tool.name} 대안·유사 서비스`;
  const description = `${tool.name}와 비슷한 AI 도구 목록. 같은 카테고리·기능의 대안을 비교해 보세요.`;
  return {
    title,
    description,
    alternates: { canonical: `${getBaseUrl()}/alternatives/${slug}` },
  };
}

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const alternatives = getSimilarTools(tool, 24);
  const category = getCategoryBySlug(tool.category);
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "AI 서비스 모음", href: "/tools" },
    ...(category ? [{ label: category.name, href: `/categories/${tool.category}` }] as { label: string; href: string }[] : []),
    { label: tool.name, href: `/tools/${tool.slug}` },
    { label: "대안" },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{tool.name} 대안</h1>
        <p className="mt-1 text-slate-600">{tool.name}와(과) 비슷한 AI 도구입니다. 총 {alternatives.length}개</p>
        <Link href={`/tools/${tool.slug}`} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">← {tool.name} 상세 보기</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alternatives.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </div>
  );
}
