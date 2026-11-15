"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type mapboxgl from "mapbox-gl";
import { Box, Layers, MapPin, Route as RouteIcon } from "lucide-react";
import Button from "@/components/ui/Button";

const STYLES = {
  streets: "mapbox://styles/mapbox/streets-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v11",
};
const ROUTE_COLOR = "#2E5A43"; // --green (Mapbox GL no lee variables CSS)
const HOME_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';

type Props = { lat: number; lon: number };
type Geometry = GeoJSON.LineString;

/** Mapa de la propiedad con satélite, vista 3D, pantalla completa y "¿Cómo llego?" (Mapbox Geocoding + Directions). */
export default function LocationMap({ lat, lon }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const routeRef = useRef<Geometry | null>(null);
  const is3DRef = useRef(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [satellite, setSatellite] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [from, setFrom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<{ distance: string; duration: string } | null>(null);

  const apply3D = useCallback((map: mapboxgl.Map, on: boolean) => {
    const has = !!map.getLayer("3d-buildings");
    if (on && !has && map.getSource("composite")) {
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        paint: {
          "fill-extrusion-color": "#ddd",
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
          "fill-extrusion-opacity": 0.6,
        },
      });
    } else if (!on && has) {
      map.removeLayer("3d-buildings");
    }
  }, []);

  const drawRoute = useCallback((map: mapboxgl.Map, geometry: Geometry) => {
    if (map.getSource("route")) {
      map.removeLayer("route");
      map.removeSource("route");
    }
    map.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry } });
    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": ROUTE_COLOR, "line-width": 5, "line-opacity": 0.85 },
    });
  }, []);

  useEffect(() => {
    if (!token || !el.current) return;
    let cancelled = false;
    let map: mapboxgl.Map | null = null;

    (async () => {
      const mb = (await import("mapbox-gl")).default;
      if (cancelled || !el.current) return;

      map = new mb.Map({
        container: el.current,
        style: STYLES.streets,
        center: [lon, lat],
        zoom: 15,
        minZoom: 10,
        accessToken: token,
      });

      const pin = document.createElement("div");
      pin.className = "pin-home";
      pin.innerHTML = HOME_SVG;
      new mb.Marker({ element: pin, anchor: "bottom" }).setLngLat([lon, lat]).addTo(map);
      map.addControl(new mb.NavigationControl(), "top-right");
      map.addControl(new mb.FullscreenControl(), "top-right");

      // Al cambiar de estilo Mapbox borra las capas: se vuelven a poner la ruta y el 3D.
      map.on("style.load", () => {
        if (!map) return;
        if (routeRef.current) drawRoute(map, routeRef.current);
        if (is3DRef.current) apply3D(map, true);
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, [token, lat, lon, apply3D, drawRoute]);

  const toggleSatellite = () => {
    const next = !satellite;
    setSatellite(next);
    mapRef.current?.setStyle(next ? STYLES.satellite : STYLES.streets);
  };

  const toggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    const next = !is3D;
    setIs3D(next);
    is3DRef.current = next;
    map.easeTo({ pitch: next ? 60 : 0, bearing: next ? -60 : 0, duration: 2000 });
    apply3D(map, next);
  };

  const getRoute = async (e: FormEvent) => {
    e.preventDefault();
    const q = from.trim();
    if (!q || !token) return;
    setLoading(true);
    setError("");
    try {
      const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}`);
      if (!geoRes.ok) throw new Error(`geocoding-${geoRes.status}`);
      const geo = await geoRes.json();
      const userLocation = geo.features?.[0]?.geometry?.coordinates;
      if (!userLocation) throw new Error("not-found");

      const [uLon, uLat] = userLocation;
      const dirRes = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${lon},${lat};${uLon},${uLat}?geometries=geojson&access_token=${token}`);
      if (!dirRes.ok) throw new Error(`directions-${dirRes.status}`);
      const dir = await dirRes.json();
      const route = dir.routes?.[0];
      if (!route) throw new Error("no-route");

      routeRef.current = route.geometry as Geometry;
      setInfo({ distance: `${(route.distance / 1000).toFixed(1)} km`, duration: `${Math.round(route.duration / 60)} min` });

      const map = mapRef.current;
      if (map) {
        drawRoute(map, routeRef.current);
        const coords = routeRef.current.coordinates as [number, number][];
        const lons = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        map.fitBounds(
          [
            [Math.min(...lons), Math.min(...lats)],
            [Math.max(...lons), Math.max(...lats)],
          ],
          { padding: 60, duration: 1200 }
        );
      }
    } catch (err) {
      console.error("Error al calcular la ruta:", err);
      setInfo(null);
      setError((err as Error).message === "not-found" ? "No encontramos ese lugar. Probá con el barrio o la calle." : "No pudimos calcular la ruta. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mapwrap">
        {token ? (
          <>
            <div ref={el} className="map-el" role="region" aria-label="Mapa con la ubicación de la propiedad" />
            <div className="mapmodes">
              <button type="button" className={satellite ? "on" : ""} aria-pressed={satellite} aria-label="Vista satélite" onClick={toggleSatellite}>
                <Layers size={18} aria-hidden="true" />
                <span>Satélite</span>
              </button>
              <button type="button" className={is3D ? "on" : ""} aria-pressed={is3D} aria-label="Vista 3D" onClick={toggle3D}>
                <Box size={18} aria-hidden="true" />
                <span>3D</span>
              </button>
            </div>
          </>
        ) : (
          <div className="map-msg">El mapa no está disponible en este momento.</div>
        )}
      </div>

      <h3 style={{ margin: "28px 0 0", fontSize: 17, fontWeight: 600 }}>¿Cómo llego?</h3>
      <form className="route" onSubmit={getRoute}>
        <label className="fl" style={{ flex: "1 1 260px" }}>
          <span className="sr-only">Desde dónde salís</span>
          <div style={{ position: "relative" }}>
            <MapPin size={18} aria-hidden="true" style={{ position: "absolute", left: 14, top: 16, color: "var(--muted)" }} />
            <input className="inp" style={{ paddingLeft: 40 }} placeholder="Desde dónde salís: barrio, calle o estación" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
        </label>
        <Button type="submit" variant="primary" disabled={loading || !from.trim() || !token}>
          <RouteIcon size={18} aria-hidden="true" />
          {loading ? "Calculando…" : "Calcular ruta"}
        </Button>
      </form>
      {error && (
        <p className="route-err" role="alert">
          {error}
        </p>
      )}
      {info && (
        <div className="route-info" role="status">
          <div>
            <span>Distancia</span>
            <b>{info.distance}</b>
          </div>
          <div>
            <span>Duración en auto</span>
            <b>{info.duration}</b>
          </div>
        </div>
      )}
    </>
  );
}
