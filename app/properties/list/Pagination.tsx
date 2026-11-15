"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hrefFor, type Filters } from "./query";

type Props = { filters: Filters; page: number; totalPages: number };

/** Anterior / números con elipsis / siguiente. Los links conservan todos los filtros. */
export default function Pagination({ filters, page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3].forEach((n) => wanted.add(n));
  const nums = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) items.push("gap");
    items.push(n);
  });

  const go = () => window.scrollTo({ top: 0 });

  return (
    <nav className="pag" aria-label="Paginación">
      {page > 1 ? (
        <Link href={hrefFor({ ...filters, page: page - 1 })} aria-label="Página anterior" onClick={go} scroll={false}>
          <ChevronLeft size={18} aria-hidden="true" />
        </Link>
      ) : (
        <span className="pg-off" aria-hidden="true">
          <ChevronLeft size={18} />
        </span>
      )}

      {items.map((it, i) =>
        it === "gap" ? (
          <span key={`g${i}`} className="gap" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={it}
            href={hrefFor({ ...filters, page: it })}
            className={it === page ? "on" : ""}
            aria-current={it === page ? "page" : undefined}
            aria-label={`Página ${it}`}
            onClick={go}
            scroll={false}
          >
            {it}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={hrefFor({ ...filters, page: page + 1 })} aria-label="Página siguiente" onClick={go} scroll={false}>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      ) : (
        <span className="pg-off" aria-hidden="true">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
