import Image from "next/image";
import { Check } from "lucide-react";
import { SITE } from "@/config/site";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const POINTS = [
  "Trato directo: hablás siempre con alguien de la inmobiliaria.",
  "Contratos y documentación revisados por profesionales matriculados.",
  "Tasaciones con valores reales del mercado local.",
];

export default function About() {
  return (
    <section className="sec band" id="nosotros">
      <div className="wrap about">
        <Reveal className="about-img">
          <Image src="/images/oficina.jpg" alt={`Oficina de ${SITE.name} en ${SITE.city}`} fill sizes="(max-width: 900px) 100vw, 580px" />
          <div className="badge">
            <b>{SITE.stats.years}+</b>
            <span>
              años atendiendo
              <br />
              en la misma oficina
            </span>
          </div>
        </Reveal>
        <Reveal>
          <span className="kicker">Nosotros</span>
          <h2 className="h2 serif">Una empresa familiar que conoce el barrio.</h2>
          <p className="sub">
            Desde hace más de {SITE.stats.years} años acompañamos a familias e inversores de {SITE.city} y alrededores en cada paso:
            desde la primera visita hasta la firma.
          </p>
          <ul className="points">
            {POINTS.map((p) => (
              <li key={p}>
                <i>
                  <Check size={16} strokeWidth={2.2} aria-hidden="true" />
                </i>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
          >
            {SITE.address}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
