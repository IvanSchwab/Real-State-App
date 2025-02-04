"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapIcon, SatelliteDish, Route, Compass, MapPin } from "lucide-react";

const MAP_STYLES = {
  normal: "mapbox://styles/mapbox/streets-v11",
  streetView: "mapbox://styles/mapbox/satellite-streets-v11",
  light: "mapbox://styles/mapbox/light-v10",
  dark: "mapbox://styles/mapbox/dark-v10",
};

const API_HEADERS = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
};

interface MapProps {
  propertyHash: string;
}

const Map: React.FC<MapProps> = ({ propertyHash }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.normal);
  const [userAddress, setUserAddress] = useState<string>("");
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}properties/${propertyHash}`,
          { method: "GET", headers: API_HEADERS }
        );

        if (!response.ok) throw new Error("Failed to fetch coordinates");

        const data = await response.json();
        const { lat, lon } = data.location;
        if (lat && lon) setCoordinates([lon, lat]);

      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [propertyHash]);

  useEffect(() => {
    if (!coordinates || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: coordinates,
      zoom: 15,
      minZoom: 10, 
      pitch: 0,
      bearing: 0,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    });
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.error('Mapbox token is missing!');
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    new mapboxgl.Marker({ color: "#B541C7" })
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="font-bold text-purple-600">Property Location</h3>`))
      .addTo(map);

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    mapRef.current = map;

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [coordinates, mapStyle]);

  const toggle3DView = useCallback(() => {
    if (mapRef.current) {
      const pitch = is3D ? 0 : 60;
      const bearing = is3D ? 0 : -60;

      mapRef.current.easeTo({
        pitch,
        bearing,
        duration: 2000
      });

      if (!is3D) {
        mapRef.current.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          paint: {
            'fill-extrusion-color': '#ddd',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      } else {
        if (mapRef.current.getLayer('3d-buildings')) {
          mapRef.current.removeLayer('3d-buildings');
        }
      }

      setIs3D(!is3D);
    }
  }, [is3D]);

  const getRoute = useCallback(async () => {
    if (!coordinates || !userAddress) return;

    try {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(userAddress)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      const userLocation = geocodeData.features[0]?.geometry.coordinates;

      if (!userLocation) throw new Error("Address not found");

      const [userLon, userLat] = userLocation;
      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates[0]},${coordinates[1]};${userLon},${userLat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
      const routeResponse = await fetch(routeUrl);
      const routeData = await routeResponse.json();

      if (routeData.routes[0]) {
        const routeGeoJson = routeData.routes[0].geometry;
        const distance = (routeData.routes[0].distance / 1000).toFixed(1);
        const duration = (routeData.routes[0].duration / 60).toFixed(0);

        setRouteInfo({
          distance: `${distance} km`,
          duration: `${duration} mins`
        });

        if (mapRef.current) {
          if (mapRef.current.getSource('route')) {
            mapRef.current.removeLayer('route');
            mapRef.current.removeSource('route');
          }

          mapRef.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: routeGeoJson
            }
          });

          mapRef.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#B541C7',
              'line-width': 4,
              'line-opacity': 0.7
            }
          });
        }
      }
    } catch (error) {
      console.error("Routing error:", error);
    }
  }, [coordinates, userAddress]);

  return (
    <div className="flex flex-col items-center my-6  bg-gray-50 p-8 rounded-3xl ">
      <div className="text-center mb-8">
        <h1 className="text-4xl  font-bold bg-gradient-to-r from-green-800 to-green-700 bg-clip-text text-transparent">
        Navegador de Propiedades
        </h1>
        <p className="mt-2 text-green-700">Explora la ubicación y encontrá tu camino</p>
      </div>
  
      <div className="relative w-full max-w-6xl h-[65vh] rounded-2xl shadow-xl overflow-hidden border-2 border-green-50">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        <div className="absolute top-36 right-2 flex flex-col gap-2">
          <button
            onClick={() => setMapStyle(MAP_STYLES.normal)}
            className="p-2 bg-white text-black rounded-lg shadow-md hover:bg-[#F2F2F2] transition-colors"
          >
            <MapIcon className="w-5 h-5 text-olive-600" />
          </button>
          <button
            onClick={() => setMapStyle(MAP_STYLES.streetView)}
            className="p-2 bg-white text-black rounded-lg shadow-md hover:bg-[#F2F2F2] transition-colors"
          >
            <SatelliteDish className="w-5 h-5 text-olive-600" />
          </button>
          <button
            onClick={toggle3DView}
            className="p-2 bg-white text-black rounded-lg shadow-md hover:bg-[#F2F2F2] transition-colors"
          >
            <Compass className="w-5 h-5 text-olive-600" />
          </button>
        </div>
      </div>
  
      <div className="mt-8  w-full max-w-6xl flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-green-700" />
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            placeholder="Ingresa tu dirección"
            className="pl-10 pr-4 py-3 w-full text-gray-500 rounded-xl border border-green-500 focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>
        
        <button
          onClick={getRoute}
          className="flex items-center gap-2 px-6 py-3 bg-olive-600  bg-green-600 text-gray-200 rounded-xl shadow-lg hover:bg-olive-700 transition-all"
        >
          <Route className="w-5 h-5" />
          Calcular Ruta
        </button>
      </div>
  
      {routeInfo && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl shadow-md flex gap-6 border border-green-100">
          <div className="text-center">
            <p className="text-sm text-green-700">Distancia</p>
            <p className="text-xl font-bold text-green-600">{routeInfo.distance}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-700">Duración</p>
            <p className="text-xl font-bold text-green-600 text-olive-600">{routeInfo.duration}</p>
          </div>
        </div>
      )}
  
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setMapStyle(MAP_STYLES.light)}
          className="px-4 py-2 bg-green-50 rounded-full shadow-md hover:bg-green-100 transition-colors text-green-800"
        >
          Light Mode
        </button>
        <button
          onClick={() => setMapStyle(MAP_STYLES.dark)}
          className="px-4 py-2 bg-green-800 text-green-50 rounded-full shadow-md hover:bg-green-700 transition-colors"
        >
          Dark Mode
        </button>
      </div>
    </div>
  );
};

export default Map;