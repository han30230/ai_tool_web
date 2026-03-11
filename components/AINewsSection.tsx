"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AINewsItem } from "@/lib/aiNewsFetcher";

/** Format ISO date for display (e.g. "Mar 9, 2025"). */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

/** Loading skeleton for a single card. */
function NewsCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 flex gap-2">
        <div className="h-5 w-20 rounded bg-slate-100" />
        <div className="h-5 w-24 rounded bg-slate-100" />
      </div>
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
    </div>
  );
}

/** Single news card with title, source badge, date, summary, link. */
function NewsCard({ item }: { item: AINewsItem }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block flex-1"
      >
        <h3 className="font-semibold text-slate-900 group-hover:text-primary line-clamp-2">
          {item.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {item.source}
          </span>
          <time className="text-xs text-slate-500" dateTime={item.publishedAt}>
            {formatDate(item.publishedAt)}
          </time>
        </div>
        {item.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
        )}
      </a>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        Read article →
      </a>
    </article>
  );
}

/**
 * Latest AI News section: fetches from /api/ai-news, shows responsive grid of cards.
 * Loading skeleton and fallback UI when RSS fails.
 */
export function AINewsSection() {
  const [items, setItems] = useState<AINewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/ai-news");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Latest AI News</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error || items.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Latest AI News</h2>
        <p className="mt-2 text-sm text-slate-600">
          News feed is temporarily unavailable. Please try again later.
        </p>
        <button
          type="button"
          onClick={() => {
            setError(false);
            setLoading(true);
            fetch("/api/ai-news")
              .then((r) => r.json())
              .then((data) => {
                setItems(Array.isArray(data) ? data : []);
                setError(false);
              })
              .catch(() => setError(true))
              .finally(() => setLoading(false));
          }}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Retry
        </button>
      </section>
    );
  }

  const displayItems = items.slice(0, 6);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Latest AI News</h2>
        <Link
          href="/news"
          className="text-sm font-medium text-primary hover:underline min-h-[44px] inline-flex items-center touch-manipulation"
        >
          View more →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item, i) => (
          <NewsCard key={`${item.link}-${i}`} item={item} />
        ))}
      </div>
    </section>
  );
}
