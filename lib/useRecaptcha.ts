"use client";
import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    // Misma firma que las declaraciones de los formularios actuales (deben coincidir).
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SCRIPT_ID = "recaptcha-v3-script";

/**
 * Carga el script de reCAPTCHA v3 una sola vez (aunque haya varios formularios
 * en la página) y expone execute() para pedir el token al enviar.
 */
export function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [siteKey]);

  const execute = useCallback(async (action = "submit"): Promise<string> => {
    if (!siteKey) throw new Error("reCAPTCHA site key is not defined");
    if (!window.grecaptcha) throw new Error("reCAPTCHA todavía no cargó");
    return window.grecaptcha.execute(siteKey, { action });
  }, [siteKey]);

  return { execute };
}
