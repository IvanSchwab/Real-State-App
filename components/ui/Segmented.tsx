"use client";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
};

/** Segmentado claro (Todas / Venta / Alquiler, USD / $...). */
export default function Segmented<T extends string>({ options, value, onChange, ariaLabel }: Props<T>) {
  return (
    <div className="lseg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={o.value === value ? "on" : ""}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
