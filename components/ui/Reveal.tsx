"use client";
import { useEffect, useRef, type ReactNode, type ElementType } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * Aparece al entrar en pantalla (clase .rv).
 * Con animation-timeline: view() lo resuelve el CSS solo; en navegadores sin
 * soporte se usa IntersectionObserver. Con prefers-reduced-motion queda estático.
 */
export default function Reveal({ as: Tag = "div", className = "", children }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    el.classList.add("rv-obs");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
