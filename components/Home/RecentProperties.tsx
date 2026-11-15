"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { apiGet } from "@/lib/api";
import PropertyCard, { type CardProperty } from "@/components/ui/PropertyCard";
import Reveal from "@/components/ui/Reveal";

const COUNT = 3;

export default function RecentProperties() {
  const [items, setItems] = useState<CardProperty[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    apiGet<{ properties?: CardProperty[] }>("properties", { size: COUNT, view: "list" }, ctrl.signal)
      .then((d) => setItems(d.properties ?? []))
      .catch((e) => {
        if (e.name === "AbortError") return;
        console.error("No se pudieron cargar las propiedades recientes:", e);
        setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  return (
    <section className="sec" id="propiedades" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-h">
          <div>
            <span className="kicker">Recién publicadas</span>
            <h2 className="h2 serif">Propiedades recientes</h2>
            <p className="sub">Lo último que sumamos a la cartera, actualizado todos los días.</p>
          </div>
          <Link className="link-arrow" href="/properties">
            Ver el catálogo completo <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
          </Link>
        </div>

        {failed ? (
          <p className="empty-note">
            No pudimos cargar las propiedades en este momento. Podés verlas todas en el <Link href="/properties">catálogo</Link>.
          </p>
        ) : items === null ? (
          <div className="grid3" aria-busy="true">
            {Array.from({ length: COUNT }, (_, i) => (
              <div key={i} className="card skel" aria-hidden="true" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="empty-note">Pronto vamos a sumar nuevas propiedades.</p>
        ) : (
          <div className="grid3">
            {items.map((p, i) => (
              <Reveal key={p.propertyHash}>
                <PropertyCard property={p} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
