"use client";
import "@/app/styles/ficha.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, Building2, ChevronDown, LayoutGrid, Ruler } from "lucide-react";
import { useProperty, galleryImages } from "@/lib/useProperty";
import { formatPrice, isRent, priceText, propertyUrl, whatsappLink, positiveSpecs } from "@/lib/format";
import { SITE } from "@/config/site";
import WhatsAppFab from "@/components/ui/WhatsAppFab";
import Button from "@/components/ui/Button";
import Gallery from "./Gallery";
import ShareMenu from "./ShareMenu";
import LocationMap from "./LocationMap";
import ContactCard from "./ContactCard";
import Similar from "./Similar";
import { hrefFor } from "../list/query";

const nf = new Intl.NumberFormat("es-AR");

export default function PropertyView({ hash }: { hash: string }) {
  const { data: p, loading, error } = useProperty(hash);
  const [more, setMore] = useState(false);
  const [backHref, setBackHref] = useState("/properties");

  // El listado guarda su última URL (con filtros) para volver exactamente ahí.
  useEffect(() => {
    try {
      const last = sessionStorage.getItem("olivera:lastListing");
      if (last && last.startsWith("/properties")) setBackHref(last);
    } catch {
      /* sessionStorage no disponible */
    }
  }, []);

  useEffect(() => {
    if (p?.title) document.title = `${p.title} | ${SITE.name}`;
  }, [p?.title]);

  const images = useMemo(() => (p ? galleryImages(p) : []), [p]);

  if (loading) {
    return (
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 96 }} aria-busy="true">
        <div className="fskel" style={{ height: 24, width: 180 }} />
        <div className="fskel" style={{ height: 52, width: "70%", margin: "26px 0" }} />
        <div className="fskel" style={{ height: 380 }} />
      </main>
    );
  }

  if (error || !p) {
    return (
      <main className="wrap">
        <div className="state-box">
          <h1 className="serif">{error === "failed" ? "No pudimos cargar la propiedad" : "Esta propiedad ya no está disponible"}</h1>
          <p>
            {error === "failed"
              ? "Hubo un problema de conexión. Probá de nuevo en unos segundos."
              : "Puede que se haya vendido o alquilado. Mirá el resto de las propiedades o escribinos y te ayudamos a encontrar algo similar."}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Button href="/properties">Ver propiedades</Button>
            <Button variant="wa" href={whatsappLink()}>
              Escribinos por WhatsApp
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const url = propertyUrl(hash);
  const rent = isRent(p.propertyOperation);
  const opLabel = rent ? "Alquiler" : "Venta";
  const opParam = p.operation ? String(p.operation) : rent ? "2" : "1";
  const priceLabel = priceText(p.price, p.currency, p.propertyOperation);
  const price = formatPrice(p.price, p.currency, p.propertyOperation);
  const status = p.sold ? "Vendida" : p.rented ? "Alquilada" : p.reserved ? "Reservada" : "";

  const place = [p.zone2Desc, p.zone1Desc].filter(Boolean).join(", ");
  const location = [p.address, place].filter(Boolean).join(" · ");

  const zone1 = p.zone1 ? String(p.zone1) : undefined;
  const zone2 = p.zone2 ? String(p.zone2) : undefined;

  const facts = [
    p.ambiences && p.ambiences > 0 ? { icon: LayoutGrid, value: String(p.ambiences), label: "Ambientes" } : null,
    p.bedrooms && p.bedrooms > 0 ? { icon: BedDouble, value: String(p.bedrooms), label: "Dormitorios" } : null,
    p.bathrooms && p.bathrooms > 0 ? { icon: Bath, value: String(p.bathrooms), label: p.bathrooms === 1 ? "Baño" : "Baños" } : null,
    positiveSpecs({ landArea: p.landArea }).length ? { icon: Ruler, value: `${nf.format(p.landArea)} m²`, label: "Superficie" } : null,
    p.propertyType ? { icon: Building2, value: p.propertyType, label: "Tipo" } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  const lat = Number(p.location?.lat);
  const lon = Number(p.location?.lon);
  const hasLocation = Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0;
  const description = (p.descriptionFormatted || p.description || "").trim();
  const longDesc = description.length > 260 || description.split("\n").length > 4;

  return (
    <>
      <main className="wrap" style={{ paddingTop: 36 }}>
        <div className="topbar">
          <Link href={backHref} className="back">
            <ArrowLeft size={18} strokeWidth={1.7} aria-hidden="true" />
            Volver a resultados
          </Link>
          <nav className="crumbs" aria-label="Migas">
            <Link href="/properties">Propiedades</Link>
            <span aria-hidden="true">/</span>
            <Link href={hrefFor({ operation: opParam })}>{opLabel}</Link>
            {p.zone2Desc && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={hrefFor({ operation: opParam, zone1, zone2 })}>{p.zone2Desc}</Link>
              </>
            )}
          </nav>
        </div>

        <div className="fhead">
          <div className="fhead-main">
            <div className="ftags">
              <span className="tag mist">{opLabel}</span>
              {p.propertyType && <span className="tag tag-line">{p.propertyType}</span>}
              {status && <span className="tag" style={{ background: "var(--ink)", color: "#fff" }}>{status}</span>}
            </div>
            <h1 className="serif ftitle">{p.title}</h1>
            {location && <p className="loc floc">{location}</p>}
          </div>
          <ShareMenu title={p.title} price={priceLabel} address={p.address} url={url} />
        </div>

        <Gallery images={images} title={p.title} />

        <div className="fgrid">
          <div>
            {facts.length > 0 && (
              <div className="facts" style={{ ["--n" as string]: facts.length }}>
                {facts.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div className="fact" key={f.label}>
                      <i>
                        <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                      </i>
                      <b className={/^\d/.test(f.value) ? undefined : "txt"}>{f.value}</b>
                      <span>{f.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {description && (
              <section className="fsec">
                <h2>Descripción</h2>
                <p className={`desc${more || !longDesc ? "" : " clamp"}`}>{description}</p>
                {longDesc && (
                  <button type="button" className="txtbtn" aria-expanded={more} onClick={() => setMore((m) => !m)}>
                    {more ? "Leer menos" : "Leer descripción completa"}
                    <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                )}
              </section>
            )}

            {hasLocation && (
              <section className="fsec">
                <h2>Ubicación</h2>
                <LocationMap lat={lat} lon={lon} />
              </section>
            )}
          </div>

          <ContactCard
            title={p.title}
            hash={hash}
            url={url}
            price={p.price}
            currency={p.currency}
            operation={p.propertyOperation}
            address={p.address}
            priceLabel={priceLabel}
          />
        </div>

        <Similar
          hash={hash}
          operation={p.operation ? Number(p.operation) : undefined}
          type={p.type ? Number(p.type) : undefined}
          zone1={p.zone1 ? Number(p.zone1) : undefined}
          zone2={p.zone2 ? Number(p.zone2) : undefined}
          zoneLabel={p.zone2Desc}
        />
        <p className="legal-note">{SITE.legalShort}</p>
      </main>

      <div className="mbar">
        <div className="col">
          <span>{rent ? "En alquiler" : "En venta"}</span>
          <span className="price">
            {price ? (
              <>
                {price.currency && <small>{price.currency}</small>}
                {price.amount}
                {price.suffix && (
                  <>
                    {" "}
                    <em>{price.suffix}</em>
                  </>
                )}
              </>
            ) : (
              "Consultar"
            )}
          </span>
        </div>
        <Button variant="wa" href={whatsappLink(`Hola, me interesa esta propiedad:\n${p.title}\nPrecio: ${priceLabel}\n${url}`)}>
          Consultar
        </Button>
      </div>
      <WhatsAppFab hideOnMobile message={`Hola, me interesa esta propiedad:\n${p.title}\nPrecio: ${priceLabel}\n${url}`} />
    </>
  );
}
