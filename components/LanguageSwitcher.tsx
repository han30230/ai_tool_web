"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("locale");
  const pathWithoutLocale = pathname === "/" ? "" : pathname;

  return (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label="Language">
      {routing.locales.map((loc) => (
        <a
          key={loc}
          href={`/${loc}${pathWithoutLocale}`}
          className={
            locale === loc
              ? "text-primary bg-primary/10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-2 py-1.5 -my-2 -mx-1 font-medium touch-manipulation"
              : "text-slate-600 hover:text-primary hover:bg-slate-100 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-2 py-1.5 -my-2 -mx-1 font-medium touch-manipulation"
          }
          aria-current={locale === loc ? "true" : undefined}
        >
          {t(loc)}
        </a>
      ))}
    </div>
  );
}
