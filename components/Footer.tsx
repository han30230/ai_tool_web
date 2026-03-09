import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 text-left text-sm text-slate-600 sm:px-6 lg:px-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <Link href="/privacy" className="min-h-[44px] inline-flex items-center px-3 py-2 -mx-1 rounded-lg hover:bg-slate-200/50 hover:text-primary touch-manipulation">개인정보처리방침</Link>
          <Link href="/terms" className="min-h-[44px] inline-flex items-center px-3 py-2 -mx-1 rounded-lg hover:bg-slate-200/50 hover:text-primary touch-manipulation">이용약관</Link>
          <Link href="/contact" className="min-h-[44px] inline-flex items-center px-3 py-2 -mx-1 rounded-lg hover:bg-slate-200/50 hover:text-primary touch-manipulation">문의</Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Copyright © 2025 AI 툴 올인원. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
