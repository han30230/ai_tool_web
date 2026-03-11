import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/categories";
import { getToolsByCategory, getCategoriesWithCount, getTotalToolsCount } from "@/lib/tools";
import { getBaseUrl } from "@/lib/site";
import { ToolCard } from "@/components/ToolCard";
import { CategoryPills } from "@/components/CategoryPills";
import { Pagination } from "@/components/Pagination";
import { Breadcrumb } from "@/components/Breadcrumb";

const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "카테고리를 찾을 수 없음" };
  const canonical = `${getBaseUrl()}/categories/${category}`;
  const ogImage = `${getBaseUrl()}/og?kind=category&title=${encodeURIComponent(cat.name)}&subtitle=${encodeURIComponent(
    cat.description
  )}&badge=${encodeURIComponent("Category")}`;
  return {
    title: `${cat.name} AI 툴 | AI 툴 올인원`,
    description: cat.description + " 카테고리의 AI 도구 목록입니다.",
    alternates: { canonical },
    openGraph: {
      title: `${cat.name} AI 툴 | AI 툴 올인원`,
      description: cat.description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: cat.name }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${cat.name} AI 툴 | AI 툴 올인원`,
      description: cat.description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page: pageStr } = await searchParams;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const tools = getToolsByCategory(category);
  const featured = tools.filter((t) => t.featured);
  const rest = tools.filter((t) => !t.featured);
  const sorted = [...featured, ...rest];

  const page = Math.max(1, parseInt(pageStr || "1", 10));
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageTools = sorted.slice(start, start + PAGE_SIZE);
  const categoriesWithCount = getCategoriesWithCount();
  const totalCount = getTotalToolsCount();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} AI 툴`,
    description: cat.description,
    numberOfItems: tools.length,
    itemListElement: pageTools.slice(0, 10).map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: t.name,
        url: `${getBaseUrl()}/tools/${t.slug}`,
        applicationCategory: cat.name,
      },
    })),
  };

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "AI 서비스 모음", href: "/tools" },
    { label: cat.name },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{cat.name}</h1>
        <p className="mt-1 text-slate-600">{cat.description}</p>
        <p className="mt-1 text-sm text-slate-500">총 {tools.length}개 툴</p>
      </div>

      <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100 w-full" />}>
        <CategoryPills categoriesWithCount={categoriesWithCount} totalCount={totalCount} />
      </Suspense>

      {featured.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">인기 툴</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-slate-900">
          {featured.length > 0 ? "전체 목록" : "툴 목록"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/categories/${category}`}
          searchParams={{}}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
