import { SITE } from "@/config/site";

const PHOTOS_BASE = "https://images.mapaprop.app/photos/";

/** Mapaprop devuelve a veces la URL completa (listado) y a veces solo el archivo (ficha). */
export function photoUrl(image?: string | null): string {
  if (!image) return "";
  return /^https?:\/\//i.test(image) ? image : `${PHOTOS_BASE}${image}`;
}

export function isRent(operation?: string | null): boolean {
  return /alquil/i.test(operation ?? "");
}

/** Normaliza la moneda de la API a lo que muestra el diseño: "USD" o "$". */
export function normalizeCurrency(currency?: string | null): string {
  const c = (currency ?? "").trim().toUpperCase();
  if (!c) return "";
  if (c.includes("USD") || c.includes("U$S") || c.includes("DOL")) return "USD";
  if (c === "$" || c.includes("ARS") || c.includes("PESO")) return "$";
  return currency!.trim();
}

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export type PriceParts = { currency: string; amount: string; suffix: string };

/**
 * Precio con moneda siempre visible y punto de miles. Alquiler con "/ mes".
 * Devuelve null si el precio no es un número positivo (la UI muestra "Consultar").
 */
export function formatPrice(
  price?: number | string | null,
  currency?: string | null,
  operation?: string | null
): PriceParts | null {
  const n = typeof price === "string" ? Number(price) : price;
  if (n == null || !Number.isFinite(n) || n <= 0) return null;
  return {
    currency: normalizeCurrency(currency),
    amount: nf.format(n),
    suffix: isRent(operation) ? "/ mes" : "",
  };
}

/** Versión en texto plano: "USD 149.999", "$ 620.000 / mes". */
export function priceText(
  price?: number | string | null,
  currency?: string | null,
  operation?: string | null
): string {
  const p = formatPrice(price, currency, operation);
  if (!p) return "Consultar precio";
  return [p.currency, p.amount, p.suffix].filter(Boolean).join(" ");
}

export type Spec = { key: "bedrooms" | "bathrooms" | "area"; label: string };

/** Dormitorios, baños y m² solo si el valor es > 0. Si no hay ninguno, []. */
export function positiveSpecs(p: {
  bedrooms?: number | null;
  bathrooms?: number | null;
  landArea?: number | null;
}): Spec[] {
  const out: Spec[] = [];
  const pos = (v?: number | null) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : 0);
  const b = pos(p.bedrooms);
  const ba = pos(p.bathrooms);
  const a = pos(p.landArea);
  if (b) out.push({ key: "bedrooms", label: `${b} dorm.` });
  if (ba) out.push({ key: "bathrooms", label: `${ba} ${ba === 1 ? "baño" : "baños"}` });
  if (a) out.push({ key: "area", label: `${nf.format(a)} m²` });
  return out;
}

/** "Calle 123, Partido": dirección + partido/ciudad, sin repetir. */
export function locationLabel(p: {
  address?: string | null;
  county?: string | null;
  city?: string | null;
}): string {
  const parts = [p.address, p.county || p.city]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
  const seen = new Set<string>();
  return parts.filter((s) => (seen.has(s.toLowerCase()) ? false : (seen.add(s.toLowerCase()), true))).join(", ");
}

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** URL pública de una ficha (mismo criterio que usaba el compartir actual). */
export function propertyUrl(hash: string): string {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}/properties/${hash}`;
}
