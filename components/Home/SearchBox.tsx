"use client";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/config/site";
import { useCatalog } from "@/lib/useCatalog";
import Tabs from "@/components/ui/Tabs";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

type Op = "buy" | "rent";

const nf = new Intl.NumberFormat("es-AR");

/**
 * Buscador del hero. Navega a /properties con los mismos parámetros de siempre
 * (type, zone1, zone2, operation, bedrooms, priceTo) más currency cuando hay tope de precio.
 */
export default function SearchBox() {
  const router = useRouter();
  const { types, zones, loading } = useCatalog();
  const [op, setOp] = useState<Op>("buy");
  const [type, setType] = useState("");
  const [zone, setZone] = useState(""); // "provincia:partido" (partido puede ir vacío)
  const [bedrooms, setBedrooms] = useState("");
  const [price, setPrice] = useState("");

  const prices = SITE.searchPrices[op === "buy" ? "buy" : "rent"];
  const suffix = op === "rent" ? " / mes" : "";

  const hint = useMemo(
    () => (op === "buy" ? `Propiedades en venta en ${SITE.city} y alrededores` : "Alquileres disponibles para mudarte ya"),
    [op]
  );

  const changeOp = (next: Op) => {
    setOp(next);
    setPrice(""); // las opciones de precio dependen de la moneda
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const [zone1, zone2] = zone.split(":");
    const q = new URLSearchParams();
    q.set("operation", op === "buy" ? "1" : "2");
    if (type) q.set("type", type);
    if (zone1) q.set("zone1", zone1);
    if (zone2) q.set("zone2", zone2);
    if (bedrooms) q.set("bedrooms", bedrooms);
    if (price) {
      q.set("priceTo", price);
      q.set("currency", prices.currency);
    }
    router.push(`/properties?${q.toString()}`);
  };

  return (
    <form className="search" onSubmit={submit}>
      <Tabs
        ariaLabel="Operación"
        value={op}
        onChange={changeOp}
        options={[
          { value: "buy", label: "Comprar" },
          { value: "rent", label: "Alquilar" },
        ]}
      >
        <Link className="tabd" href="#tasacion">
          Tasar mi propiedad
        </Link>
      </Tabs>

      <div className="fields">
        <Field id="f-tipo" label="Tipo" variant="glass" chevron>
          <select id="f-tipo" value={type} onChange={(e) => setType(e.target.value)} disabled={loading && types.length === 0}>
            <option value="">Todos</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.description}
              </option>
            ))}
          </select>
        </Field>

        <Field id="f-zona" label="Zona" variant="glass" chevron>
          <select id="f-zona" value={zone} onChange={(e) => setZone(e.target.value)} disabled={loading && zones.length === 0}>
            <option value="">Todas las zonas</option>
            {zones.map((z) => (
              <optgroup key={z.id} label={z.description}>
                <option value={`${z.id}:`}>Toda {z.description}</option>
                {(z.counties ?? []).map((c) => (
                  <option key={c.id} value={`${z.id}:${c.id}`}>
                    {c.description}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <Field id="f-dorm" label="Dormitorios" variant="glass" chevron>
          <select id="f-dorm" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            <option value="">Indistinto</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>

        <Field id="f-precio" label="Precio hasta" variant="glass" chevron>
          <select id="f-precio" value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">{prices.noCap}</option>
            {prices.steps.map((s) => (
              <option key={s} value={s}>
                {prices.symbol} {nf.format(s)}
                {suffix}
              </option>
            ))}
          </select>
        </Field>

        <Button type="submit" variant="y" className="go">
          Buscar
        </Button>
      </div>

      <div className="more">
        <span>{hint}</span>
      </div>
    </form>
  );
}
