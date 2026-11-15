import { SITE } from "@/config/site";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

export default function Stats() {
  const { years, operations, activeRentals } = SITE.stats;
  return (
    <div className="wrap">
      <div className="stats">
        <Reveal className="stat">
          <b><CountUp value={years} prefix="+" /></b>
          <span>años en el barrio</span>
        </Reveal>
        <Reveal className="stat">
          <b><CountUp value={operations} prefix="+" /></b>
          <span>operaciones acompañadas</span>
        </Reveal>
        <Reveal className="stat">
          <b><CountUp value={activeRentals} prefix="~" /></b>
          <span>alquileres en curso hoy</span>
        </Reveal>
        <Reveal className="stat lic">
          <strong>Martilleros matriculados</strong>
          {SITE.license && <span>Matrícula {SITE.license}</span>}
        </Reveal>
      </div>
    </div>
  );
}
