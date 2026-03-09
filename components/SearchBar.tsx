"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";

export function SearchBar({ placeholder = "AI 툴 검색..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (pathname.startsWith("/tools")) {
      const params = new URLSearchParams(window.location.search);
      params.set("q", q);
      router.push(`/tools?${params.toString()}`);
    } else {
      router.push(`/tools?q=${encodeURIComponent(q)}`);
    }
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-14 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px]"
          aria-label="검색"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-2.5 min-h-[40px] text-sm font-medium text-white hover:bg-primary-dark active:opacity-90 touch-manipulation"
        >
          검색
        </button>
      </div>
    </form>
  );
}
