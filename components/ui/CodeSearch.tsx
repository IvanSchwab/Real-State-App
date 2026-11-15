"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Hash, Search, X } from "lucide-react";
import Button from "./Button";

export const OPEN_CODE_SEARCH_EVENT = "olivera:open-code-search";

interface CodeProperty {
  code: string;
  propertyHash: string;
}

/**
 * Misma consulta que el buscador por código original: GET properties?codeSearch=
 * y coincidencia exacta contra `code` de cada resultado.
 */
function useCodeSearch(onFound?: () => void) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setError("");
    const searchCode = value.trim();
    if (!searchCode) {
      setError("Ingresá un código de propiedad.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiUrl || !apiKey) {
      console.error("Missing API configuration");
      setError("No pudimos realizar la búsqueda. Probá de nuevo más tarde.");
      return;
    }

    setLoading(true);
    try {
      const queryString = new URLSearchParams({ codeSearch: searchCode }).toString();
      const response = await fetch(`${apiUrl}/properties?${queryString}&oauth_token=${apiKey}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!response.ok) throw new Error("No se pudo obtener las propiedades.");

      const data: { properties: CodeProperty[] } = await response.json();
      const found = data.properties.find((prop) => prop.code === searchCode);

      if (found) {
        router.push(`/properties/${found.propertyHash}`);
        onFound?.();
      } else {
        setError("No encontramos ninguna propiedad con ese código.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al buscar la propiedad.");
    } finally {
      setLoading(false);
    }
  }, [value, router, onFound]);

  return { value, setValue, error, setError, loading, search };
}

/** Buscar por código: campo en la barra (escritorio) y lupa + modal (celular). */
export default function CodeSearch() {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const modalInput = useRef<HTMLInputElement | null>(null);
  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);
  const { value, setValue, error, setError, loading, search } = useCodeSearch(() => setOpen(false));

  useEffect(() => {
    const openFromOutside = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(OPEN_CODE_SEARCH_EVENT, openFromOutside);
    return () => window.removeEventListener(OPEN_CODE_SEARCH_EVENT, openFromOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    modalInput.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void search();
  };

  return (
    <>
      <form className="code" role="search" onSubmit={submit}>
        <Hash size={18} strokeWidth={1.7} aria-hidden="true" />
        <label htmlFor="code-inline" className="sr-only">
          Buscar por código
        </label>
        <input
          id="code-inline"
          type="text"
          placeholder="Código"
          value={value}
          autoComplete="off"
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          aria-describedby={error ? "code-inline-err" : undefined}
          aria-invalid={error ? true : undefined}
        />
        {error && !open && (
          <span id="code-inline-err" className="code-err" role="alert">
            {error}
          </span>
        )}
      </form>

      <button
        type="button"
        className="code-btn"
        aria-label="Buscar por código"
        onClick={(e) => {
          opener.current = e.currentTarget;
          setOpen(true);
        }}
      >
        <Search size={20} strokeWidth={1.7} aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div className="modal-bg page" onMouseDown={(e) => e.target === e.currentTarget && close()}>
            <form className="modal" role="dialog" aria-modal="true" aria-labelledby="code-modal-title" onSubmit={submit}>
              <button type="button" className="modal-x" aria-label="Cerrar" onClick={close}>
                <X size={20} aria-hidden="true" />
              </button>
              <h2 id="code-modal-title">Buscar por código</h2>
              <label className="fl">
                Código de la propiedad
                <input
                  ref={modalInput}
                  type="text"
                  placeholder="Código"
                  value={value}
                  autoComplete="off"
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (error) setError("");
                  }}
                />
              </label>
              {error && (
                <p className="err" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Buscando…" : "Buscar"}
              </Button>
            </form>
          </div>,
          document.body
        )}
    </>
  );
}

/** Link del footer que abre el mismo modal. */
export function OpenCodeSearch({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="flink" onClick={() => window.dispatchEvent(new Event(OPEN_CODE_SEARCH_EVENT))}>
      {children}
    </button>
  );
}
