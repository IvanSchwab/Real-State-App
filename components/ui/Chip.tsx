"use client";
import { X } from "lucide-react";

/** Chip de filtro activo, removible. */
export function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="chipf">
      {label}
      <button type="button" aria-label={`Quitar ${label}`} onClick={onRemove}>
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </span>
  );
}

/** Opción tipo botón para filtros (Tipo, Dormitorios). */
export function Pill({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`pill${on ? " on" : ""}`} aria-pressed={on} onClick={onClick}>
      {label}
    </button>
  );
}
