"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navKeys = [
  { href: "/tools", labelKey: "tools" as const },
  { href: "/collections", labelKey: "collections" as const },
  { href: "/pricing/free", labelKey: "freeTools" as const },
  { href: "/articles", labelKey: "articles" as const },
  { href: "/news", labelKey: "news" as const },
  { href: "/contact", labelKey: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileDrawer =
    open ? (
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
          aria-label={t("menu")}
        >
          <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-100">
            <span className="font-semibold text-slate-900">{t("menu")}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 touch-manipulation"
              aria-label={t("menuClose")}
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>
          <nav className="flex flex-1 min-h-0 flex-col gap-1 px-2 pt-4 overflow-y-auto">
            {navKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="min-h-[48px] flex items-center px-4 rounded-xl text-slate-700 font-medium hover:bg-slate-100 active:bg-slate-200 touch-manipulation"
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <div className="mt-2 px-4 py-2 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-2">Language</span>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </>
    ) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[padding:env(safe-area-inset)]:pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-primary sm:text-xl shrink-0">
          {tCommon("siteName")}
        </Link>

        <div className="hidden md:flex items-center gap-5 lg:gap-6">
          <nav className="flex items-center gap-5 lg:gap-6">
            {navKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-primary min-h-[44px] min-w-[44px] inline-flex items-center justify-center -my-2 -mx-1 px-1"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 touch-manipulation"
          aria-label={t("menuOpen")}
          aria-expanded={open}
          aria-controls="mobile-drawer"
        >
          <span className="sr-only">{t("menuOpen")}</span>
          <span className="w-5 h-0.5 bg-current rounded-full mb-1.5" />
          <span className="w-5 h-0.5 bg-current rounded-full mb-1.5" />
          <span className="w-5 h-0.5 bg-current rounded-full" />
        </button>
      </div>

      {mounted && mobileDrawer ? createPortal(mobileDrawer, document.body) : null}
    </header>
  );
}
