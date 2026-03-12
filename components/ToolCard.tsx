"use client";

import { Link } from "@/i18n/navigation";
import type { Tool } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import { ToolLogo } from "@/components/ToolLogo";

interface ToolCardProps {
  tool: Tool;
  /** When true, logo loads with high priority (use for first row). */
  priority?: boolean;
}

/**
 * Modern SaaS-style tool card.
 * [logo 40px] Tool name, description, tags, pricing/category badges
 */
export function ToolCard({ tool, priority = false }: ToolCardProps) {
  const category = getCategoryBySlug(tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 active:bg-slate-50/50 touch-manipulation min-h-[120px]"
    >
      <div className="flex items-start gap-3">
        <ToolLogo tool={tool} size={40} className="rounded-lg bg-slate-100" priority={priority} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 group-hover:text-primary">
            {tool.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">
            {tool.description}
          </p>
          {tool.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {tool.pricing}
            </span>
            {tool.korean_support && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                한국어
              </span>
            )}
            {category && (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
