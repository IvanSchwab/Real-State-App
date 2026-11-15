"use client";
import { useEffect, useRef, useState } from "react";

type Props = { value: number; prefix?: string; duration?: number };

/** Cuenta de 0 al valor (ease-out cúbico) al entrar en pantalla. Con reduced-motion muestra el valor final. */
export default function CountUp({ value, prefix = "", duration = 1800 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / duration);
          setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {n}
    </span>
  );
}
