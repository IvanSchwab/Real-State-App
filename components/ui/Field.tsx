import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  /** glass: buscador del hero · panel: formulario sobre verde profundo · plain: sobre fondo claro */
  variant?: "glass" | "panel" | "plain";
  /** Muestra la flecha (para <select>). */
  chevron?: boolean;
  full?: boolean;
  className?: string;
  /** El control real (input/select/textarea) con su id; el estilo lo da el contenedor. */
  children: ReactNode;
};

/** Etiqueta + control con el estilo del sistema. Siempre label real asociado por htmlFor. */
export default function Field({ id, label, variant = "plain", chevron, full, className = "", children }: Props) {
  const wrapper = variant === "glass" ? "fd" : variant === "panel" ? `in${full ? " full" : ""}` : "fl";
  return (
    <div className={`${wrapper}${className ? ` ${className}` : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {chevron && (
        <span className="chev" aria-hidden="true">
          <ChevronDown size={16} strokeWidth={1.7} />
        </span>
      )}
    </div>
  );
}
