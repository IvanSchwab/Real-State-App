"use client";
import { useEffect, useState } from "react";
import type { PropertyTypeOption, Zone } from "@/lib/useCatalog";
import { Pill } from "@/components/ui/Chip";
import Segmented from "@/components/ui/Segmented";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import type { Filters } from "./query";

type Cur = "USD" | "ARS";

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  types: PropertyTypeOption[];
  zones: Zone[];
  /** Solo en el bottom sheet (celular). */
  onClose?: () => void;
};

const digits = (s: string) => s.replace(/\D/g, "");

/** Filtros laterales: Tipo, Zona, Dormitorios y Precio. Solo filtros que la API soporta. */
export default function Filters({ filters, onChange, types, zones, onClose }: Props) {
  const defaultCur: Cur = filters.operation === "2" ? "ARS" : "USD";
  const [cur, setCur] = useState<Cur>((filters.currency as Cur) || defaultCur);
  const [from, setFrom] = useState(filters.priceFrom ?? "");
  const [to, setTo] = useState(filters.priceTo ?? "");

  // La URL manda: si cambia desde afuera (chips, limpiar, atrás), se refleja acá.
  useEffect(() => {
    setFrom(filters.priceFrom ?? "");
    setTo(filters.priceTo ?? "");
    setCur((filters.currency as Cur) || (filters.operation === "2" ? "ARS" : "USD"));
  }, [filters.priceFrom, filters.priceTo, filters.currency, filters.operation]);

  const commitPrice = (nextFrom = from, nextTo = to, nextCur = cur) => {
    const f = digits(nextFrom);
    const t = digits(nextTo);
    if (f === (filters.priceFrom ?? "") && t === (filters.priceTo ?? "") && nextCur === (filters.currency ?? (f || t ? cur : ""))) return;
    onChange({ priceFrom: f, priceTo: t, currency: f || t ? nextCur : "" });
  };

  const zoneValue = filters.zone1 ? `${filters.zone1}:${filters.zone2 ?? ""}` : "";
  const onZone = (v: string) => {
    const [zone1, zone2] = v.split(":");
    onChange({ zone1: zone1 || "", zone2: zone2 || "" });
  };

  return (
    <aside className="side" aria-label="Filtros">
      <div className="sheet-x">
        <b style={{ fontSize: 18 }}>Filtros</b>
        <Button variant="ghost" onClick={onClose} style={{ height: 44 }}>
          Cerrar
        </Button>
      </div>

      <div className="grp">
        <h3>Tipo</h3>
        <div className="pills">
          {types.map((t) => (
            <Pill
              key={t.id}
              label={t.description}
              on={filters.type === String(t.id)}
              onClick={() => onChange({ type: filters.type === String(t.id) ? "" : String(t.id) })}
            />
          ))}
        </div>
      </div>

      <div className="grp">
        <h3>Zona</h3>
        <label className="selx">
          <span className="sr-only">Zona</span>
          <select value={zoneValue} onChange={(e) => onZone(e.target.value)}>
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
          <ChevronIcon />
        </label>
      </div>

      <div className="grp">
        <h3>Dormitorios</h3>
        <div className="pills">
          {[1, 2, 3, 4].map((n) => (
            <Pill
              key={n}
              label={String(n)}
              on={filters.bedrooms === String(n)}
              onClick={() => onChange({ bedrooms: filters.bedrooms === String(n) ? "" : String(n) })}
            />
          ))}
        </div>
      </div>

      <div className="grp">
        <h3>Precio</h3>
        <Segmented<Cur>
          ariaLabel="Moneda"
          value={cur}
          options={[
            { value: "USD", label: "USD" },
            { value: "ARS", label: "$" },
          ]}
          onChange={(c) => {
            setCur(c);
            if (filters.priceFrom || filters.priceTo) commitPrice(from, to, c);
          }}
        />
        <div className="inl">
          <Field id="price-from" label="Mínimo" variant="plain" className="sr-label">
            <input
              id="price-from"
              inputMode="numeric"
              placeholder="Mínimo"
              value={from}
              onChange={(e) => setFrom(digits(e.target.value))}
              onBlur={() => commitPrice()}
              onKeyDown={(e) => e.key === "Enter" && commitPrice()}
            />
          </Field>
          <Field id="price-to" label="Máximo" variant="plain" className="sr-label">
            <input
              id="price-to"
              inputMode="numeric"
              placeholder="Máximo"
              value={to}
              onChange={(e) => setTo(digits(e.target.value))}
              onBlur={() => commitPrice()}
              onKeyDown={(e) => e.key === "Enter" && commitPrice()}
            />
          </Field>
        </div>
      </div>

      {onClose && (
        <Button
          variant="primary"
          className="sheet-only"
          onClick={() => {
            commitPrice();
            onClose();
          }}
        >
          Ver resultados
        </Button>
      )}
    </aside>
  );
}

function ChevronIcon() {
  return (
    <span className="chev" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
