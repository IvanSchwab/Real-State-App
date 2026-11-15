/**
 * Cliente mínimo de la API de Mapaprop. Misma forma de llamada que ya usaba el sitio:
 * GET {NEXT_PUBLIC_API_URL}{path}?{params}&oauth_token={key} con Authorization: Bearer.
 */
export type ApiParams = Record<string, string | number | null | undefined>;

export async function apiGet<T>(path: string, params: ApiParams = {}, signal?: AbortSignal): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiUrl || !apiKey) throw new Error("Missing API configuration");

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const query = qs.toString();

  const response = await fetch(`${apiUrl}${path}?${query ? `${query}&` : ""}oauth_token=${apiKey}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
    signal,
  });
  if (!response.ok) throw new Error(`Error ${response.status} al consultar ${path}`);
  return response.json() as Promise<T>;
}
