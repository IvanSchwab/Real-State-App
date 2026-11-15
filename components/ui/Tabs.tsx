"use client";
import type { ReactNode } from "react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  /** Elementos extra al final (ej. el link "Tasar mi propiedad"; usar className="tabd"). */
  children?: ReactNode;
};

/** Pestañas con subrayado amarillo animado, para el panel de vidrio oscuro del hero. */
export default function Tabs<T extends string>({ options, value, onChange, ariaLabel, children }: Props<T>) {
  return (
    <div className="tabs" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`tabd${o.value === value ? " on" : ""}`}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
      {children}
    </div>
  );
}
