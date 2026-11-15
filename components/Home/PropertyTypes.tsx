"use client";
import Link from "next/link";
import { ArrowRight, Building2, Car, Home, Landmark, Mountain, Store, type LucideIcon } from "lucide-react";
import { useCatalog } from "@/lib/useCatalog";
import Reveal from "@/components/ui/Reveal";

/** Orden e ícono por id de tipo de la API (ids de Mapaprop). Un tipo nuevo cae al final con ícono genérico. */
const TILES: Record<number, { label: string; icon: LucideIcon; order: number }> = {
  2: { label: "Casas", icon: Home, order: 1 },
  1: { label: "Departamentos", icon: Building2, order: 2 },
  10: { label: "PH", icon: Landmark, order: 3 },
  9: { label: "Locales", icon: Store, order: 4 },
  4: { label: "Terrenos", icon: Mountain, order: 5 },
  15: { label: "Garages", icon: Car, order: 6 },
};

export default function PropertyTypes() {
  const { types, loading } = useCatalog();

  const tiles = [...types]
    .map((t) => ({ id: t.id, ...(TILES[t.id] ?? { label: t.description, icon: Building2, order: 99 }) }))
    .sort((a, b) => a.order - b.order);

  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <span className="kicker">Explorá</span>
            <h2 className="h2 serif">¿Qué estás buscando?</h2>
          </div>
          <Link className="link-arrow" href="/properties">
            Ver todas las propiedades <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
          </Link>
        </div>
        <div className="types">
          {loading && tiles.length === 0
            ? Array.from({ length: 6 }, (_, i) => <span key={i} className="type skel" aria-hidden="true" />)
            : tiles.map((t) => {
                const Icon = t.icon;
                return (
                  <Reveal key={t.id} as="div">
                    <Link className="type" href={`/properties?type=${t.id}`}>
                      <span className="type-ic">
                        <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <b>{t.label}</b>
                        <small>
                          Ver {t.label === "PH" ? "PH" : t.label.toLowerCase()} <ArrowRight size={14} strokeWidth={1.7} aria-hidden="true" />
                        </small>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}
