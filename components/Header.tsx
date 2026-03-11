"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const nav = [
  { href: "/tools", label: "AI 서비스 모음" },
  { href: "/collections", label: "컬렉션" },
  { href: "/pricing/free", label: "무료 툴" },
  { href: "/articles", label: "AI 관련 글" },
  { href: "/news", label: "AI 소식" },
  { href: "/contact", label: "문의" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[padding:env(safe-area-inset)]:pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-primary sm:text-xl shrink-0">
          AI 툴 올인원
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-primary min-h-[44px] min-w-[44px] inline-flex items-center justify-center -my-2 -mx-1 px-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 touch-manipulation"
          aria-label="메뉴 열기"
          aria-expanded={open}
          aria-controls="mobile-drawer"
        >
          <span className="sr-only">메뉴 열기</span>
          <span className="w-5 h-0.5 bg-current rounded-full mb-1.5" />
          <span className="w-5 h-0.5 bg-current rounded-full mb-1.5" />
          <span className="w-5 h-0.5 bg-current rounded-full" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/50 md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-drawer"
            className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-[min(360px,90vw)] bg-white shadow-xl md:hidden flex flex-col pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-label="메뉴"
          >
            <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-100">
              <span className="font-semibold text-slate-900">메뉴</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 touch-manipulation"
                aria-label="메뉴 닫기"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <nav className="flex flex-col px-2 pt-4 overflow-y-auto">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="min-h-[48px] flex items-center px-4 rounded-xl text-slate-700 font-medium hover:bg-slate-100 active:bg-slate-200 touch-manipulation"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
