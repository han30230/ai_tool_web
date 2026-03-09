import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && <span className="text-slate-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary min-h-[44px] inline-flex items-center py-1 -my-1 touch-manipulation">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-700 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
