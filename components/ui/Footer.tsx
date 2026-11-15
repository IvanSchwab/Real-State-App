import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SITE } from "@/config/site";
import { whatsappLink } from "@/lib/format";
import { OpenCodeSearch } from "./CodeSearch";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot" id="contacto">
      <div className="wrap">
        <div className="foot-g">
          <div>
            <Image src="/images/logo-fondo-verde.png" alt={SITE.name} width={949} height={392} style={{ height: 72, width: "auto", borderRadius: 10 }} />
            <p style={{ margin: "18px 0 0", fontSize: 15, lineHeight: 1.6, maxWidth: 300, color: "rgba(255,255,255,.72)" }}>{SITE.tagline}</p>
            <div className="soc">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={20} aria-hidden="true" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook size={20} aria-hidden="true" />
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div>
            <h4>Propiedades</h4>
            <ul>
              <li><Link href="/properties?operation=1">En venta</Link></li>
              <li><Link href="/properties?operation=2">En alquiler</Link></li>
              <li><OpenCodeSearch>Buscar por código</OpenCodeSearch></li>
            </ul>
          </div>
          <div>
            <h4>Inmobiliaria</h4>
            <ul>
              <li><Link href="/#nosotros">Nosotros</Link></li>
              <li><Link href="/#tasacion">Tasaciones</Link></li>
              <li><Link href="/#contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>{SITE.address}</li>
              <li><a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></li>
              {SITE.license && <li>Colegio de Martilleros · Mat. {SITE.license}</li>}
            </ul>
          </div>
        </div>
        <div className="legal">
          <p style={{ maxWidth: 760 }}>{SITE.legal}</p>
          <p>
            © {year} {SITE.name} · Software:{" "}
            <a href={SITE.developer.url} target="_blank" rel="noopener noreferrer">
              {SITE.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
