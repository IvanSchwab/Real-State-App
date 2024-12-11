import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
import Link from 'next/link'; 

interface Type {
  description: string;
  id: number;
}

interface Zone {
  description: string;
  id: number;
  counties?: {
    description: string;
    id: number;
  }[];
}

export const useFetchData = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [typesRes, zonesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL_TYPES}`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL_ZONES}`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }),
        ]);

        if (!typesRes.ok || !zonesRes.ok) {
          throw new Error('Error fetching data');
        }

        const typesData = await typesRes.json();
        const zonesData = await zonesRes.json();

        setTypes(typesData.types || typesData);
        setZones(zonesData.states || zonesData);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { types, zones, loading, error };
};

const SearchBox = () => {
  const { types, zones, loading, error } = useFetchData();
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const buildQueryString = () => {
    const query: Record<string, string | number | null> = {
      type: selectedType,
      zone: selectedZone,
      county: selectedCounty,
      query: searchQuery,
    };

    const queryString = Object.entries(query)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return queryString;
  };

  return (
    <div className="w-full md:-[80%] mx-auto bg-[#f8fcf3] h-[4rem] sm:h-[5rem] flex px-4 sm:px-8 flex-col justify-center rounded-lg">
      <div className="flex items-center justify-between h-full">
        <input
          type="text"
          placeholder="Ingresa una dirección, ubicación o calle"
          className="sm:flex-[0.8] h-[60%] bg-[#e5e9e0] block rounded-lg outline-none px-4 placeholder:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedType || ''}
          onChange={(e) => setSelectedType(Number(e.target.value) || null)}
          className="h-[60%] bg-[#e5e9e0] block rounded-lg outline-none px-4"
        >
          <option value="">Tipo</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.description}
            </option>
          ))}
        </select>

        <select
          value={selectedZone || ''}
          onChange={(e) => setSelectedZone(Number(e.target.value) || null)}
          className="h-[60%] bg-[#e5e9e0] block rounded-lg outline-none px-4"
        >
          <option value="">Zona</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.description}
            </option>
          ))}
        </select>

        {selectedZone && (
          <select
            value={selectedCounty || ''}
            onChange={(e) => setSelectedCounty(Number(e.target.value) || null)}
            className="h-[60%] bg-[#e5e9e0] block rounded-lg outline-none px-4"
          >
            <option value="">Condado</option>
            {zones
              .find((zone) => zone.id === selectedZone)
              ?.counties?.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.description}
                </option>
              ))}
          </select>
        )}

        <div className="flex items-center flex-[0.2] ml-8 space-x-6">
          <div className="lg:flex hidden items-center cursor-pointer space-x-2">
            <HiAdjustmentsHorizontal className="text-gray-700 w-6 h-6" />
            <p className="select-none text-gray-700 font-semibold">Busqueda avanzada</p>
          </div>
        </div>
        <Link href={`/properties?${buildQueryString()}`}>
          <div className="w-12 h-12 bg-[#A4B494] flex items-center hover:bg-[#E3C565] transition-all duration-150 cursor-pointer justify-center text-white rounded-full">
            <FaSearch />
          </div>
        </Link>
      </div>

      {loading && <p>Cargando datos...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default SearchBox;
