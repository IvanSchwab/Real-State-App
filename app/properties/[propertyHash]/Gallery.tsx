"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import type { GalleryImage } from "@/lib/useProperty";
import Lightbox from "./Lightbox";

const ZOOM = 2.2;

type Props = { images: GalleryImage[]; title: string };

/** Escritorio: 1 grande + 4 chicas con lupa sobre la principal. Celular: carrusel con scroll-snap y puntos. */
export default function Gallery({ images, title }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [dot, setDot] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [canHover, setCanHover] = useState(false);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches);
  }, []);

  if (images.length === 0) {
    return <div className="gal-empty">Esta propiedad todavía no tiene fotos.</div>;
  }

  const shown = images.slice(0, 5);
  const n = Math.min(images.length, 5);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover) return;
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };

  const onScroll = () => {
    const el = track.current;
    if (el) setDot(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <>
      <div className={`gal n${n}`}>
        {shown.map((im, i) => (
          <button
            key={im.src}
            type="button"
            className="ph-tile"
            aria-label={`Ver foto ${i + 1} de ${images.length} en pantalla completa`}
            onClick={() => setOpen(i)}
            onMouseMove={i === 0 ? onMove : undefined}
            onMouseLeave={i === 0 ? () => setLens(null) : undefined}
          >
            <Image src={im.src} alt={i === 0 ? title : `Foto ${i + 1} de la propiedad`} fill sizes={i === 0 ? "(max-width: 1240px) 60vw, 720px" : "300px"} priority={i === 0} loading={i === 0 ? undefined : "lazy"} />
            {i === 0 && lens && (
              <span className="lens" aria-hidden="true" style={{ left: lens.x - 110, top: lens.y - 110 }}>
                <div
                  style={{
                    width: lens.w * ZOOM,
                    height: lens.h * ZOOM,
                    backgroundImage: `url("${im.src}")`,
                    transform: `translate(${110 - lens.x * ZOOM}px, ${110 - lens.y * ZOOM}px)`,
                  }}
                />
              </span>
            )}
          </button>
        ))}
        {images.length > 1 && (
          <button type="button" className="gal-all" onClick={() => setOpen(0)}>
            <Images size={18} aria-hidden="true" />
            Ver todas las fotos ({images.length})
          </button>
        )}
      </div>

      <div className="mgal" ref={track} onScroll={onScroll} aria-label="Galería de fotos" role="group">
        {images.map((im, i) => (
          <button key={im.src} type="button" aria-label={`Ver foto ${i + 1} de ${images.length} en pantalla completa`} onClick={() => setOpen(i)}>
            <Image src={im.src} alt={i === 0 ? title : `Foto ${i + 1} de la propiedad`} fill sizes="100vw" priority={i === 0} loading={i === 0 ? undefined : "lazy"} />
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mdots" aria-hidden="true">
          {images.map((im, i) => (
            <span key={im.src} className={i === dot ? "on" : ""} />
          ))}
        </div>
      )}

      {open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} title={title} />}
    </>
  );
}
