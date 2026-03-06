import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 text-left text-sm text-slate-600 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/privacy" className="hover:text-primary">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-primary">이용약관</Link>
          <Link href="/contact" className="hover:text-primary">문의</Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Copyright © 2025 AI 툴 올인원. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
