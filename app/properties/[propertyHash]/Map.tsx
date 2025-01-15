"use client";
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ propertyHash }: { propertyHash: string }) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HASH}${propertyHash}`, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error('Error al obtener las coordenadas');
        }

        const data = await response.json();

        const { lat, lon } = data.location;

        if (lat && lon) {
          console.log('Coordenadas obtenidas:', { lat, lon });
          setCoordinates([lat, lon]);
        } else {
          console.error('Coordenadas no disponibles');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchCoordinates();
  }, [propertyHash]);

  useEffect(() => {
    if (coordinates) {
      if (mapInstance) {
        mapInstance.remove();
      }

      const map = L.map('map', {
        center: coordinates,
        zoom: 15,
        minZoom: 10, 
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const customIcon = L.icon({
        iconUrl: '/images/map-pin.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker(coordinates, { icon: customIcon }).addTo(map)
        .bindPopup('Propiedad aquí.')
        .openPopup();


      L.marker(coordinates, { icon: customIcon }).addTo(map)

      setMapInstance(map);
    }
  }, [coordinates]);

  return (
    <div className="flex flex-col items-center my-6 bg-cream p-4 rounded-lg shadow-md  bg-gray-200">
      <h2 className="text-3xl font-semibold mb-4 text-center text-gray-600">Ubicación de la Propiedad</h2>
      <div className="relative w-full max-w-[65%] h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] rounded-xl shadow-lg overflow-hidden bg-white">
        <div
          id="map"
          className="w-full h-full"
        ></div>
      </div>
    </div>
  );
};

export default Map;
