import Image from "next/image";
import { SITE } from "@/config/site";
import SearchBox from "./SearchBox";

const WORDS = ["Tu", "próximo", "hogar,", "en"];

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-media">
        <div className="hero-par">
          <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" />
        </div>
        <div className="hero-shade" />
      </div>
      <div className="hero-c">
        <div className="wrap">
          <span className="eyebrow">
            <span className="dot" />
            Más de {SITE.stats.years} años en {SITE.city}
          </span>
          <h1 className="h1 serif">
            {WORDS.map((w, i) => (
              <span key={w}>
                <span className="w" style={{ animationDelay: `${i * 0.08}s` }}>
                  {w}
                </span>{" "}
              </span>
            ))}
            <span className="w mark" style={{ animationDelay: `${WORDS.length * 0.08}s` }}>
              buenas manos.
              <svg viewBox="0 0 400 22" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 15 C 90 5, 220 4, 396 12" />
              </svg>
            </span>
          </h1>
          <p className="lead">Comprá, alquilá o vendé con una inmobiliaria familiar que conoce cada cuadra del barrio.</p>
          <SearchBox />
        </div>
      </div>
    </section>
  );
}
