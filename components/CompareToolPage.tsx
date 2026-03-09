"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Tool } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import { getFeatures, getShortDescription } from "@/lib/tool-detail";
import { ToolLogo } from "@/components/ToolLogo";

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function hasFreePlan(tool: Tool): boolean {
  if (tool.pricing === "무료" || tool.pricing === "무료+유료") return true;
  const plans = tool.pricing_plans ?? [];
  return plans.some((p) => /\bfree\b|무료|\$0\b|₩0\b/i.test(p.price));
}

function hasApi(tool: Tool): boolean {
  const tagHit = tool.tags.some((t) => /api/i.test(t));
  if (tagHit) return true;
  const features = getFeatures(tool);
  return features.some((f) => /api/i.test(f));
}

function encodeToolsParam(slugs: string[]): string {
  return slugs.join(",");
}

function decodeToolsParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CompareToolPage({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const fromTools = decodeToolsParam(searchParams.get("tools"));
    const addOne = searchParams.get("add")?.trim();
    const next = uniq([...(fromTools ?? []), ...(addOne ? [addOne] : [])]);
    if (next.length > 0) setSelected(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedTools = useMemo(() => {
    const set = new Set(selected.map((s) => s.toLowerCase()));
    return tools.filter((t) => set.has(t.slug.toLowerCase()));
  }, [selected, tools]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) => {
      const hay = `${t.name} ${t.description} ${t.tags.join(" ")} ${t.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, tools]);

  const canCompare = selectedTools.length >= 3;

  function toggle(slug: string) {
    setSelected((prev) => {
      const lower = slug.toLowerCase();
      const exists = prev.some((s) => s.toLowerCase() === lower);
      const next = exists ? prev.filter((s) => s.toLowerCase() !== lower) : [...prev, slug];
      return uniq(next);
    });
  }

  function clear() {
    setSelected([]);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("tools");
    next.delete("add");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function shareLink() {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tools", encodeToolsParam(selectedTools.map((t) => t.slug)));
    next.delete("add");
    const url = `${window.location.origin}${pathname}?${next.toString()}`;
    navigator.clipboard?.writeText(url);
  }

  function syncUrl() {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tools", encodeToolsParam(selectedTools.map((t) => t.slug)));
    next.delete("add");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI 툴 비교</h1>
        <p className="mt-1 text-slate-600">
          비교할 툴을 여러 개 선택하면 가격/기능을 한눈에 확인할 수 있어요. (최소 3개)
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="툴 이름/태그로 검색..."
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <span className="text-sm text-slate-500">
            선택됨: <span className="font-semibold text-slate-900">{selectedTools.length}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              syncUrl();
              const el = document.getElementById("compare-table");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            disabled={!canCompare}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary/90"
          >
            비교하기
          </button>
          <button
            type="button"
            onClick={shareLink}
            disabled={selectedTools.length === 0}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            링크 복사
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            선택 초기화
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredTools.slice(0, 120).map((tool) => {
          const checked = selected.some((s) => s.toLowerCase() === tool.slug.toLowerCase());
          const category = getCategoryBySlug(tool.category);
          return (
            <label
              key={tool.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-sm transition-colors ${
                checked ? "border-primary/40 bg-primary/5" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                checked={checked}
                onChange={() => toggle(tool.slug)}
              />
              <ToolLogo tool={tool} size={40} className="rounded-lg bg-slate-100" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{tool.name}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{tool.pricing}</span>
                      {tool.korean_support && (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">한국어</span>
                      )}
                      {category && (
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{category.name}</span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{getShortDescription(tool)}</p>
                  </div>
                </div>
                {tool.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tool.tags.slice(0, 6).map((tag) => (
                      <span key={tag} className="rounded bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <section id="compare-table" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">비교 표</h2>
            <p className="mt-1 text-sm text-slate-600">
              {canCompare ? "선택한 툴을 표로 비교합니다." : "비교하려면 3개 이상의 툴을 선택해 주세요."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[920px] w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Tool</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Free Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Main Features</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">API</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
              </tr>
            </thead>
            <tbody>
              {selectedTools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    아직 선택된 툴이 없습니다.
                  </td>
                </tr>
              ) : (
                selectedTools.map((tool) => {
                  const category = getCategoryBySlug(tool.category);
                  const features = getFeatures(tool).slice(0, 6);
                  return (
                    <tr key={tool.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ToolLogo tool={tool} size={28} className="rounded-md bg-slate-100" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900">{tool.name}</div>
                            <a href={`/tools/${tool.slug}`} className="text-xs text-primary hover:underline">
                              상세 보기 →
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{tool.pricing}</td>
                      <td className="px-4 py-3 text-slate-700">{hasFreePlan(tool) ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-slate-700">
                        <ul className="space-y-1">
                          {features.map((f, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-slate-400">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{hasApi(tool) ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-slate-700">{category?.name ?? tool.category}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

