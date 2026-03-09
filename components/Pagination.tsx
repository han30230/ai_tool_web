"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (page > 1) params.set("page", String(page));
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
  };

  return (
    <nav className="flex items-center justify-center gap-2 py-6" aria-label="페이지 네비게이션">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
        >
          이전
        </Link>
      )}
      <span className="px-3 py-2 text-sm text-slate-600 flex items-center min-h-[44px]">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
        >
          다음
        </Link>
      )}
    </nav>
  );
}
