import Link from "next/link";

const nav = [
  { href: "/tools", label: "AI 서비스 모음" },
  { href: "/articles", label: "AI 관련 글" },
  { href: "/news", label: "AI 소식" },
  { href: "/contact", label: "문의" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-primary">
          AI 툴 올인원
        </Link>
        <nav className="flex gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
