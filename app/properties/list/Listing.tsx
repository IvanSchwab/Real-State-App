"use client";
import "@/app/styles/listing.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useCatalog } from "@/lib/useCatalog";
import PropertyCard, { type CardProperty } from "@/components/ui/PropertyCard";
import Segmented from "@/components/ui/Segmented";
import { Chip } from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import FiltersPanel from "./Filters";
import Pagination from "./Pagination";
import { PAGE_SIZE, activeCount, hrefFor, readFilters, type Filters } from "./query";

const nf = new Intl.NumberFormat("es-AR");

type Result = { properties?: CardProperty[]; total?: number };

export default function Listing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams?.toString() ?? "";
  const parsed = useMemo(() => readFilters(new URLSearchParams(key)), [key]);
  const { page, ...filters } = parsed;
  const { types, zones } = useCatalog();

  const [items, setItems] = useState<CardProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [sheet, setSheet] = useState(false);

  // Mismos parámetros que ya usaba el listado, más priceFrom y currency (la API los soporta).
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);
    apiGet<Result>(
      "properties",
      {
        size: PAGE_SIZE,
        from: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        operation: filters.operation,
        type: filters.type,
        bedrooms: filters.bedrooms,
        priceFrom: filters.priceFrom,
        priceTo: filters.priceTo,
        currency: filters.currency,
        zone1: filters.zone1,
        zone2: filters.zone2,
      },
      ctrl.signal
    )
      .then((d) => {
        setItems(d.properties ?? []);
        setTotal(d.total ?? 0);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        console.error("Error al cargar propiedades:", e);
        setError(true);
        setLoading(false);
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, retry]);

  // Para que la ficha pueda volver a esta misma vista (con filtros y página).
  useEffect(() => {
    try {
      sessionStorage.setItem("olivera:lastListing", key ? `/properties?${key}` : "/properties");
    } catch {
      /* sessionStorage no disponible */
    }
  }, [key]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheet]);

  /** Cambia filtros: vuelve a la página 1 y no mueve el scroll. */
  const update = useCallback(
    (patch: Partial<Filters>) => {
      router.push(hrefFor({ ...filters, ...patch, page: 1 }), { scroll: false });
    },
    [router, filters]
  );

  const clearAll = () => router.push(hrefFor({ operation: filters.operation }), { scroll: false });

  const chips = useMemo(() => {
    const out: { label: string; remove: Partial<Filters> }[] = [];
    if (filters.type) {
      const t = types.find((x) => String(x.id) === filters.type);
      if (t) out.push({ label: t.description, remove: { type: "" } });
    }
    if (filters.zone1 || filters.zone2) {
      const z = zones.find((x) => String(x.id) === filters.zone1);
      const c = z?.counties?.find((x) => String(x.id) === filters.zone2);
      const label = c?.description ?? z?.description;
      if (label) out.push({ label, remove: { zone1: "", zone2: "" } });
    }
    if (filters.bedrooms) {
      const n = Number(filters.bedrooms);
      out.push({ label: `${n} dormitorio${n === 1 ? "" : "s"}`, remove: { bedrooms: "" } });
    }
    if (filters.priceFrom || filters.priceTo) {
      const sym = filters.currency === "ARS" ? "$" : filters.currency === "USD" ? "USD" : "";
      const n = (v?: string) => (v ? nf.format(Number(v)) : "");
      const label =
        filters.priceFrom && filters.priceTo
          ? `${sym} ${n(filters.priceFrom)} – ${n(filters.priceTo)}`
          : filters.priceTo
            ? `Hasta ${sym} ${n(filters.priceTo)}`
            : `Desde ${sym} ${n(filters.priceFrom)}`;
      out.push({ label: label.replace(/\s+/g, " ").trim(), remove: { priceFrom: "", priceTo: "", currency: "" } });
    }
    return out;
  }, [filters, types, zones]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const nActive = activeCount(filters);

  const status = loading
    ? "Buscando propiedades…"
    : total === 0
      ? "Sin resultados"
      : `${nf.format(total)} ${total === 1 ? "propiedad" : "propiedades"} · Página ${Math.min(page, totalPages)} de ${totalPages}`;

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 96 }}>
      <nav className="crumbs" aria-label="Migas">
        <Link href="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span>Propiedades</span>
      </nav>

      <div className="lhead">
        <div>
          <h1 className="serif">Propiedades</h1>
          <p aria-live="polite">{status}</p>
        </div>
        <Segmented
          ariaLabel="Operación"
          value={filters.operation ?? ""}
          options={[
            { value: "", label: "Todas" },
            { value: "1", label: "Venta" },
            { value: "2", label: "Alquiler" },
          ]}
          onChange={(v) => update({ operation: v })}
        />
      </div>

      <div className="tools">
        <Button variant="ghost" className="mfilt" onClick={() => setSheet(true)} aria-haspopup="dialog">
          <SlidersHorizontal size={18} aria-hidden="true" />
          Filtros{nActive ? ` · ${nActive}` : ""}
        </Button>
        {chips.map((c) => (
          <Chip key={c.label} label={c.label} onRemove={() => update(c.remove)} />
        ))}
        {chips.length > 0 && (
          <button type="button" className="clear" onClick={clearAll}>
            Limpiar todo
          </button>
        )}
      </div>

      <div className={`lbody${sheet ? " sheet" : ""}`}>
        {sheet && <div className="sheet-bg" onClick={() => setSheet(false)} aria-hidden="true" />}
        <FiltersPanel filters={filters} onChange={update} types={types} zones={zones} onClose={() => setSheet(false)} />

        <section className="res" aria-label="Resultados" aria-busy={loading}>
          {loading ? (
            Array.from({ length: PAGE_SIZE }, (_, i) => <div key={i} className="card skel" aria-hidden="true" />)
          ) : error ? (
            <div className="empty-box">
              <h2 className="serif">No pudimos cargar las propiedades</h2>
              <p>Hubo un problema de conexión. Probá de nuevo en unos segundos.</p>
              <div className="row">
                <Button onClick={() => setRetry((n) => n + 1)}>Reintentar</Button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-box">
              <h2 className="serif">No encontramos propiedades</h2>
              <p>
                {page > 1
                  ? "Esta página no tiene resultados."
                  : "No hay propiedades con los filtros elegidos. Probá quitando alguno o escribinos y te ayudamos a encontrar lo que buscás."}
              </p>
              <div className="row">
                {page > 1 ? (
                  <Button href={hrefFor({ ...filters })}>Ir a la primera página</Button>
                ) : (
                  chips.length > 0 && <Button onClick={clearAll}>Limpiar filtros</Button>
                )}
                <Button variant="ghost" href="/">
                  Volver al inicio
                </Button>
              </div>
            </div>
          ) : (
            items.map((p, i) => <PropertyCard key={p.propertyHash} property={p} priority={i < 3} />)
          )}
        </section>
      </div>

      {!loading && !error && <Pagination filters={filters} page={Math.min(page, totalPages)} totalPages={totalPages} />}
    </main>
  );
}
