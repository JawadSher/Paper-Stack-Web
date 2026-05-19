import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <span key={item.href} className="flex items-center gap-1">
                {index > 0 ? (
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                ) : null}
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        ) : null}
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
