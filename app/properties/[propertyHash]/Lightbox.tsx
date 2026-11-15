"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/useProperty";

type Props = {
  images: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  title: string;
};

/** Visor a pantalla completa: flechas/teclado, swipe, pellizco, doble clic y arrastre con zoom. */
export default function Lightbox({ images, index, onIndex, onClose, title }: Props) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement | null>(null);
  const imgBox = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const touch = useRef({ startX: 0, endX: 0, pan: null as { x: number; y: number } | null, dist: 0, base: 1 });
  const n = images.length;

  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);
  const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex]);

  const reset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };
  useEffect(reset, [index]);

  // Teclado, foco y bloqueo del scroll de fondo mientras el visor está abierto.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  const limit = (x: number, y: number, s = scale) => {
    if (!imgBox.current || !stage.current) return { x, y };
    const sr = stage.current.getBoundingClientRect();
    const ox = Math.max((imgBox.current.offsetWidth * s - sr.width) / 2, 0);
    const oy = Math.max((imgBox.current.offsetHeight * s - sr.height) / 2, 0);
    return { x: Math.min(Math.max(x, -ox), ox), y: Math.min(Math.max(y, -oy), oy) };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = touch.current;
    if (e.touches.length === 1) {
      t.startX = t.endX = e.touches[0].clientX;
      t.pan = { x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y };
    } else if (e.touches.length === 2) {
      t.dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      t.base = scale;
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = touch.current;
    if (e.touches.length === 1 && scale === 1) t.endX = e.touches[0].clientX;
    else if (e.touches.length === 1 && t.pan) setPos(limit(e.touches[0].clientX - t.pan.x, e.touches[0].clientY - t.pan.y));
    else if (e.touches.length === 2 && t.dist) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      setScale(Math.min(Math.max((d / t.dist) * t.base, 1), 4));
    }
  };
  const onTouchEnd = () => {
    const t = touch.current;
    if (scale === 1 && n > 1) {
      if (t.startX - t.endX > 50) next();
      else if (t.startX - t.endX < -50) prev();
    }
    t.dist = 0;
    t.pan = null;
  };

  const onDouble = () => (scale === 1 ? setScale(2) : reset());

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    const sx = e.clientX - pos.x;
    const sy = e.clientY - pos.y;
    const move = (ev: MouseEvent) => setPos(limit(ev.clientX - sx, ev.clientY - sy));
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`Fotos de ${title}`}>
      <div className="lb-top">
        <span className="lb-count" aria-live="polite">
          {index + 1} / {n}
        </span>
        <button ref={closeBtn} type="button" className="lb-btn" aria-label="Cerrar visor de fotos" onClick={onClose}>
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="lb-stage" ref={stage} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {n > 1 && (
          <button type="button" className="lb-btn lb-nav prev" aria-label="Foto anterior" onClick={prev}>
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
        )}
        <div
          ref={imgBox}
          className="lb-img"
          onDoubleClick={onDouble}
          onMouseDown={onMouseDown}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transition: scale === 1 ? "transform .3s var(--ease)" : "none" }}
        >
          <Image src={images[index].src} alt={`Foto ${index + 1} de ${n}`} fill sizes="92vw" priority draggable={false} />
        </div>
        {n > 1 && (
          <button type="button" className="lb-btn lb-nav next" aria-label="Foto siguiente" onClick={next}>
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        )}
      </div>

      {n > 1 && (
        <div className="lb-thumbs" role="group" aria-label="Todas las fotos">
          {images.map((im, i) => (
            <button key={im.src} type="button" className={i === index ? "on" : ""} aria-label={`Ver foto ${i + 1}`} aria-current={i === index} onClick={() => onIndex(i)}>
              <Image src={im.thumb} alt="" fill sizes="84px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
