"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { apiGet } from "@/lib/api";
import PropertyCard, { type CardProperty } from "@/components/ui/PropertyCard";
import { hrefFor } from "../list/query";

type Props = {
  hash: string;
  operation?: number;
  type?: number;
  zone1?: number;
  zone2?: number;
  zoneLabel?: string;
};

type Result = { properties?: CardProperty[] };

/** Propiedades similares: misma operación y zona; si hay pocas, se completa con el mismo tipo. */
export default function Similar({ hash, operation, type, zone1, zone2, zoneLabel }: Props) {
  const [items, setItems] = useState<CardProperty[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const get = (params: Record<string, string | number | undefined>) =>
      apiGet<Result>("properties", { size: 6, limit: 6, ...params }, ctrl.signal).then((d) => d.properties ?? []);

    (async () => {
      try {
        const byZone = zone2 ? await get({ operation, zone1, zone2 }) : [];
        let all = byZone.filter((p) => p.propertyHash !== hash);
        if (all.length < 3) {
          const byType = await get({ operation, type });
          const seen = new Set(all.map((p) => p.propertyHash));
          all = [...all, ...byType.filter((p) => p.propertyHash !== hash && !seen.has(p.propertyHash))];
        }
        setItems(all.slice(0, 3));
      } catch (e) {
        if ((e as Error).name !== "AbortError") console.error("No se pudieron cargar propiedades similares:", e);
      }
    })();
    return () => ctrl.abort();
  }, [hash, operation, type, zone1, zone2]);

  if (items.length === 0) return null;

  const more = hrefFor({ operation: operation ? String(operation) : undefined, zone1: zone1 ? String(zone1) : undefined, zone2: zone2 ? String(zone2) : undefined });

  return (
    <section className="sec" style={{ paddingTop: 72, paddingBottom: 40 }}>
      <div className="sec-h" style={{ marginBottom: 28 }}>
        <div>
          <span className="kicker">Seguí mirando</span>
          <h2 className="h2 serif" style={{ fontSize: 40 }}>
            Propiedades similares
          </h2>
        </div>
        <Link className="link-arrow" href={more}>
          {zoneLabel ? `Ver más en ${zoneLabel}` : "Ver más propiedades"} <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid3">
        {items.map((p) => (
          <PropertyCard key={p.propertyHash} property={p} />
        ))}
      </div>
    </section>
  );
}
