/** Filtros del listado. Todo el estado vive en la URL (compartible). */
export type Filters = {
  operation?: string; // 1 venta · 2 alquiler
  type?: string;
  zone1?: string; // provincia
  zone2?: string; // partido
  bedrooms?: string; // valor exacto (así lo filtra la API)
  priceFrom?: string;
  priceTo?: string;
  currency?: string; // USD | ARS
};

export const PAGE_SIZE = 9;

const KEYS: (keyof Filters)[] = ["operation", "type", "zone1", "zone2", "bedrooms", "priceFrom", "priceTo", "currency"];

type Params = { get(name: string): string | null };

export function readFilters(sp: Params): Filters & { page: number } {
  const f: Filters = {};
  KEYS.forEach((k) => {
    const v = sp.get(k);
    if (v) f[k] = v;
  });
  const page = parseInt(sp.get("page") ?? "1", 10);
  return { ...f, page: Number.isFinite(page) && page > 0 ? page : 1 };
}

/** Querystring sin vacíos. `page` solo si es mayor a 1. */
export function buildQuery(f: Filters & { page?: number }): string {
  const q = new URLSearchParams();
  KEYS.forEach((k) => {
    if (f[k]) q.set(k, f[k] as string);
  });
  if (f.page && f.page > 1) q.set("page", String(f.page));
  return q.toString();
}

export function hrefFor(f: Filters & { page?: number }): string {
  const qs = buildQuery(f);
  return qs ? `/properties?${qs}` : "/properties";
}

/** Cantidad de filtros activos (sin contar la operación, que tiene su propio selector). */
export function activeCount(f: Filters): number {
  let n = 0;
  if (f.type) n++;
  if (f.zone1 || f.zone2) n++;
  if (f.bedrooms) n++;
  if (f.priceFrom || f.priceTo) n++;
  return n;
}
