import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useParams } from 'next/navigation';
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

const FilterBox = () => {
  const { types, zones, loading, error } = useFetchData();
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const params = useParams();

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

  const getTitle = () => {
    if (params && (params.query || params.type || params.zone || params.county || params.priceMin || params.priceMax)) {
      return `Resultados de búsqueda para: ${params.query || 'Cualquier propiedad'}`;
    }

    return "¡Propiedades en venta y alquiler!";
  };

  return (
    <div className="inset-0 z-[100] fixed w-full " >

      <div className=" top-0 w-full bg-white shadow-lg ">

        <Link href="/">
          <div className="hidden md:block absolute top-4 left-4 w- h-24 rounded-lg overflow-hidden shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110">
            <img
              src="/images/logo-hero.png"
              alt="Logo de Olivera de Schwab"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </Link>

        <div className="relative max-w-4xl mx-auto px-4 py-6 bg-white">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{getTitle()}</h2>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block lg:hidden p-2 text-gray-600 hover:text-gray-800"
          >
            <HiAdjustmentsHorizontal className="text-gray-700 w-6 h-6" />
          </button>

          <div
            className={`lg:flex lg:space-x-4 space-y-4 lg:space-y-0 flex-col lg:flex-row transition-all duration-300 ease-in-out transform ${isMobileMenuOpen
              ? 'max-h-[400px] overflow-y-auto'
              : 'max-h-0 overflow-hidden'
              } lg:max-h-none lg:overflow-visible`}
          >
            <div className="lg:w-64">
              <label htmlFor="search" className="block text-gray-600 font-medium">
                Buscar propiedades
              </label>
              <div className="flex items-center mt-2 border border-gray-300 rounded-lg p-2">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ingresa palabra clave"
                  className="flex-grow focus:outline-none"
                />
              </div>
            </div>

            <div className="lg:w-64">
              <label htmlFor="type" className="block text-gray-600 font-medium">
                Tipo de propiedad
              </label>
              <select
                id="type"
                value={selectedType || ''}
                onChange={(e) => setSelectedType(Number(e.target.value))}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">Seleccionar tipo</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:w-64">
              <label htmlFor="zone" className="block text-gray-600 font-medium">
                Zona
              </label>
              <select
                id="zone"
                value={selectedZone || ''}
                onChange={(e) => setSelectedZone(Number(e.target.value))}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">Seleccionar zona</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.description}
                  </option>
                ))}
              </select>
            </div>

            {selectedZone && (
              <div className="lg:w-64">
                <label htmlFor="county" className="block text-gray-600 font-medium">
                  Condado
                </label>
                <select
                  id="county"
                  value={selectedCounty || ''}
                  onChange={(e) => setSelectedCounty(Number(e.target.value))}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="">Seleccionar condado</option>
                  {zones
                    .find((zone) => zone.id === selectedZone)
                    ?.counties?.map((county) => (
                      <option key={county.id} value={county.id}>
                        {county.description}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="lg:w-64">
              <label htmlFor="priceRange" className="block text-gray-600 font-medium">
                Rango de precio
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="mt-2"
              />
              <div className="flex justify-between text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div className="lg:w-64 flex justify-between items-center">
            <Link href={`/properties?${buildQueryString()}`}>
                <button
                  className="px-4 py-2 bg-custom-green text-white rounded-lg hover:bg-opacity-80 w-full"
                >
                  Filtrar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
