"use client";
import { useEffect, useState } from "react";
import { apiGet } from "./api";
import type { PropertyData } from "@/constant/constant";
import { photoUrl } from "./format";

type State = { data: PropertyData | null; loading: boolean; error: "notfound" | "failed" | null };

/**
 * Ficha de una propiedad: una sola consulta a GET properties/{hash}
 * (antes se repetía tres veces: título, detalle y mapa).
 */
export function useProperty(hash: string): State {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!hash) return;
    const ctrl = new AbortController();
    setState({ data: null, loading: true, error: null });
    apiGet<PropertyData>(`properties/${hash}`, {}, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        console.error("Error al cargar la propiedad:", e);
        setState({ data: null, loading: false, error: /Error 4\d\d/.test(e.message) ? "notfound" : "failed" });
      });
    return () => ctrl.abort();
  }, [hash]);

  return state;
}

export type GalleryImage = { src: string; thumb: string };

/** Fotos de la ficha: principal primero, imagen completa y miniatura (URLs listas para usar). */
export function galleryImages(p: PropertyData): GalleryImage[] {
  const imgs = [...(p.images ?? [])].sort((a, b) => Number(!a.main) - Number(!b.main) || (a.order ?? 0) - (b.order ?? 0));
  return imgs
    .filter((i) => i.image)
    .map((i) => ({ src: photoUrl(i.image), thumb: photoUrl(i.thumbnail || i.image) }));
}
