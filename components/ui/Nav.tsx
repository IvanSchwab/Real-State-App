import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SITE } from "@/config/site";
import { whatsappLink } from "@/lib/format";
import CodeSearch from "./CodeSearch";

/**
 * Barra superior sticky de vidrio. Escritorio: logo · links · buscar por código · Escribinos.
 * Celular: logo + lupa de código + WhatsApp.
 */
export default function Nav() {
  return (
    <header className="nav">
      <nav className="nav-in" aria-label="Principal">
        <Link href="/" className="nav-logo" aria-label={`${SITE.name}, inicio`}>
          <Image src="/images/logo.png" alt="" width={546} height={204} priority style={{ height: 44, width: "auto" }} />
        </Link>
        <div className="nav-links">
          {SITE.nav.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-end">
          <CodeSearch />
          <a className="btn btn-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp">
            <FaWhatsapp size={22} aria-hidden="true" />
            <span className="nav-wa-txt">Escribinos</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
