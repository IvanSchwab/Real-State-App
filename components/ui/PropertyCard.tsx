import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { formatPrice, isRent, locationLabel, photoUrl, positiveSpecs } from "@/lib/format";

export type CardProperty = {
  propertyHash: string;
  title: string;
  price?: number | null;
  currency?: string | null;
  propertyOperation?: string | null;
  mainImage?: string | null;
  address?: string | null;
  county?: string | null;
  city?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  landArea?: number | null;
  sold?: boolean;
  rented?: boolean;
  reserved?: boolean;
};

const SPEC_ICON = { bedrooms: BedDouble, bathrooms: Bath, area: Ruler } as const;

type Props = {
  property: CardProperty;
  /** Primera imagen above-the-fold: carga con prioridad. */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Card de propiedad (Home, Listado, Similares). Es un <Link>: clic medio y Ctrl/Cmd funcionan nativo. */
export default function PropertyCard({
  property: p,
  priority,
  sizes = "(max-width: 900px) 100vw, (max-width: 1280px) 50vw, 400px",
  className = "",
}: Props) {
  const price = formatPrice(p.price, p.currency, p.propertyOperation);
  const specs = positiveSpecs(p);
  const loc = locationLabel(p);
  const src = photoUrl(p.mainImage);
  const rent = isRent(p.propertyOperation);
  const status = p.sold ? "Vendida" : p.rented ? "Alquilada" : p.reserved ? "Reservada" : "";

  return (
    <Link href={`/properties/${p.propertyHash}`} className={`card${className ? ` ${className}` : ""}`}>
      <div className="card-img">
        {src && (
          <Image src={src} alt="" fill sizes={sizes} priority={priority} loading={priority ? undefined : "lazy"} style={{ objectFit: "cover" }} />
        )}
        {p.propertyOperation && <span className={`tag${rent ? " rent" : ""}`}>{p.propertyOperation}</span>}
        {status && <span className="tag status">{status}</span>}
      </div>
      <div className="card-b">
        <div className="price">
          {price ? (
            <>
              {price.currency && <small>{price.currency}</small>}
              {price.amount}
              {price.suffix && <> <em>{price.suffix}</em></>}
            </>
          ) : (
            <span style={{ fontSize: 22 }}>Consultar precio</span>
          )}
        </div>
        <h3 className="card-t">{p.title}</h3>
        {loc && (
          <div className="loc">
            <MapPin size={16} strokeWidth={1.7} aria-hidden="true" />
            {loc}
          </div>
        )}
        {specs.length > 0 && (
          <div className="specs">
            {specs.map((s) => {
              const Icon = SPEC_ICON[s.key];
              return (
                <span key={s.key}>
                  <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                  {s.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
