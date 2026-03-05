"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CategoryWithCount {
  slug: string;
  name: string;
  count: number;
}

interface ToolsFilterProps {
  current: {
    category?: string;
    pricing?: string;
    korean?: boolean;
    tag?: string;
    search?: string;
    sort?: string;
  };
  categoriesWithCount: CategoryWithCount[];
}

const PRICING_OPTIONS = [
  { value: "", label: "가격 전체" },
  { value: "무료", label: "무료" },
  { value: "무료+유료", label: "무료+유료" },
  { value: "유료", label: "유료" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "인기순" },
  { value: "name", label: "이름순" },
  { value: "new", label: "최신순" },
];

export function ToolsFilter({ current, categoriesWithCount }: ToolsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams?.toString() || "");
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600">카테고리</label>
        <select
          value={current.category || ""}
          onChange={(e) => updateParams({ category: e.target.value || undefined })}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
        >
          <option value="">전체</option>
          {categoriesWithCount.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600">가격</label>
        <select
          value={current.pricing || ""}
          onChange={(e) => updateParams({ pricing: e.target.value || undefined })}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
        >
          {PRICING_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={current.korean || false}
          onChange={(e) => updateParams({ korean: e.target.checked ? "1" : undefined })}
          className="rounded border-slate-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-medium text-slate-600">한국어 지원만</span>
      </label>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600">정렬</label>
        <select
          value={current.sort || "featured"}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
