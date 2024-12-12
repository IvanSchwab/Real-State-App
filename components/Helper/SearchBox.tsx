import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
import Link from 'next/link';
import Fade from 'react-awesome-reveal';

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
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="w-[95%] md:-[80%] mx-auto bg-[#7c8f7c] h-[4rem] sm:h-[5rem] flex px-4 sm:px-8 flex-col justify-center rounded-lg shadow-lg">
      <div className="flex items-center justify-between h-full">
        <input
          type="text"
          placeholder="Ingresa una dirección, ubicación o calle"
          className=" w-[75%] h-[60%] bg-[#A4B494] text-[#ddecde] rounded-lg outline-none font-bold px-4 placeholder:text-sm placeholder:text-[#ddecde] focus:ring-2 focus:ring-[#E3C565] transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center ml-[-18] relative">
          {showAdvanced && (
            <Fade>
              <div
                className={`space-x-4 absolute top-8 left-[-12] xs:ml-[-160px] ml-[-200px]  sm:ml-[-126px] md:ml-[-106px] w-64 max-w-md bg-[#7C8F7C] p-4 rounded-lg shadow-sm z-10 transition-all duration-300              ${showAdvanced ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              >
                <select
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(Number(e.target.value) || null)}
                  className="w-48 h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-200 ml-4"
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
                  className="w-48 h-12 bg-[#A4B494] text-[#ddecde] rounded-lg outline-none font-semibold px-4 focus:ring-2 focus:ring-[#E3C565] transition-all duration-200 mt-2"
                >
                  <option value="">Zona</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.description}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCounty || ''}
                  onChange={(e) => setSelectedCounty(Number(e.target.value) || null)}
                  disabled={!selectedZone}
                  className={`w-48 h-12 bg-[#A4B494] text-[#ddecde] rounded-lg outline-none font-semibold px-4 focus:ring-2 focus:ring-[#E3C565] transition-all duration-200 mt-2 ${!selectedZone ? 'bg-[#737c72]' : ''
                    }`}
                >
                  <option value="">Ciudad</option>
                  {selectedZone &&
                    zones
                      .find((zone) => zone.id === selectedZone)
                      ?.counties?.map((county) => (
                        <option key={county.id} value={county.id}>
                          {county.description}
                        </option>
                      ))}
                </select>
              </div>
            </Fade>
          )}
          <div
            className="flex items-center cursor-pointer space-x-2 select-none"
            onClick={handleClick}
          >
            <HiAdjustmentsHorizontal className="text-[#ddecde] flex w-6 h-6 transition-transform duration-300" />
            <p className="lg:flex hidden select-none text-[#ddecde] font-semibold">
              Busqueda Avanzada
            </p>
          </div>
        </div>

        <Link href={`/properties?${buildQueryString()}`}>
          <div className="w-12 h-12 bg-[#dfc05a] flex items-center hover:bg-[#d8b542] transition-all duration-150 cursor-pointer justify-center text-white rounded-full">
            <FaSearch />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SearchBox;
