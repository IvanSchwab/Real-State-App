"use client";
import { useEffect, useState } from "react";
import { apiGet } from "./api";

export interface PropertyTypeOption {
  id: number;
  description: string;
}
export interface County {
  id: number;
  description: string;
}
export interface Zone {
  id: number;
  description: string;
  counties?: County[];
}

type Catalog = { types: PropertyTypeOption[]; zones: Zone[] };

// Una sola consulta por carga de página, aunque varios componentes la pidan.
let cache: Promise<Catalog> | null = null;

function loadCatalog(): Promise<Catalog> {
  if (!cache) {
    cache = Promise.all([
      apiGet<{ types?: PropertyTypeOption[] } | PropertyTypeOption[]>("types"),
      apiGet<{ states?: Zone[] } | Zone[]>("zones"),
    ])
      .then(([t, z]) => ({
        types: Array.isArray(t) ? t : t.types ?? [],
        zones: Array.isArray(z) ? z : z.states ?? [],
      }))
      .catch((e) => {
        cache = null; // permite reintentar
        throw e;
      });
  }
  return cache;
}

/** Tipos de propiedad y zonas (provincia → partido) desde la API. */
export function useCatalog() {
  const [data, setData] = useState<Catalog>({ types: [], zones: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    loadCatalog()
      .then((c) => alive && setData(c))
      .catch((e) => console.error("No se pudo cargar tipos y zonas:", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { ...data, loading };
}
