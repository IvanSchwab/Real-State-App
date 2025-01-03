import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

  return { types, zones };
};

const FilterBox = () => {
  const { types, zones } = useFetchData();
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [operation, setOperation] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const params = useParams();

  const buildQueryString = () => {
    const query: Record<string, string | number | null> = {
      type: selectedType,
      zone1: selectedZone,
      zone2: selectedCounty,
      query: searchQuery,
      operation,
      bedrooms,
      priceTo,
    };

    const queryString = Object.entries(query)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return queryString;
  };

  const getTitle = () => {
    return '¡Propiedades en venta y alquiler!';
  };

  return (
    <div className="fixed w-full">
      <div className="top-0 w-full bg-[#94b190] shadow-xl rounded-b-lg">
        <Link href="/">
          <div className="hidden w-[12%] h-[46%] lg:block absolute top-2 left-4 rounded-lg overflow-hidden shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110">
            <img
              src="/images/logo-hero.png"
              alt="Logo de Olivera de Schwab"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </Link>
  
        <div className="relative max-w-4xl mx-auto px-4 py-4">
          <h2 className="text-2xl font-semibold text-white mb-3 text-center lg:text-left">
            {getTitle()}
          </h2>
  
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block lg:hidden mx-auto p-2 text-white bg-custom-green rounded-lg hover:bg-opacity-80 transition-all duration-300 ease-in-out w-4/5 text-center"
          >
            Filtrar
          </button>
  
          <div
            className={`lg:flex lg:space-x-4 space-y-2 lg:space-y-0 flex-col lg:flex-row transition-all duration-300 ease-in-out transform ${isMobileMenuOpen
              ? 'max-h-[300px] overflow-y-auto'
              : 'max-h-0 overflow-hidden'
              } lg:max-h-none lg:overflow-visible`}
          >
            <div className="lg:w-64">
              <select
                id="type"
                value={selectedType || ''}
                onChange={(e) => setSelectedType(Number(e.target.value))}
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
              >
                <option value="">Tipo</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.description}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="lg:w-64">
              <select
                id="zone"
                value={selectedZone || ''}
                onChange={(e) => setSelectedZone(Number(e.target.value))}
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
              >
                <option value="">Provincia</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.description}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="lg:w-64">
              <select
                id="county"
                value={selectedCounty || ''}
                onChange={(e) => setSelectedCounty(Number(e.target.value))}
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
                disabled={!selectedZone}
              >
                <option value="">Partido</option>
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
  
            <div className="lg:w-64">
              <select
                id="operation"
                value={operation || ''}
                onChange={(e) => setOperation(Number(e.target.value))}
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
              >
                <option value="">Operación</option>
                <option value={1}>Venta</option>
                <option value={2}>Alquiler</option>
              </select>
            </div>
  
            <div className="lg:w-64">
              <select
                id="bedrooms"
                value={bedrooms || ''}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
              >
                <option value="">Habitaciones</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4+</option>
              </select>
            </div>
  
            <div className="lg:w-64">
              <input
                type="number"
                id="priceTo"
                value={priceTo || ''}
                onChange={(e) => setPriceTo(Number(e.target.value))}
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
                placeholder="Valor"
              />
            </div>
  
          </div>
  
          {isMobileMenuOpen && (
            <Link href={`/properties?${buildQueryString()}`}>
              <button
                className="px-4 py-3 bg-custom-green mt-4 text-white rounded-lg hover:bg-opacity-80 w-full transition-all duration-300 ease-in-out transform hover:scale-105 block lg:hidden"
              >
                Buscar
              </button>
            </Link>
          )}
  
          <Link href={`/properties?${buildQueryString()}`}>
            <button
              className="px-4 py-3 bg-custom-green mt-4 text-white rounded-lg hover:bg-opacity-80 w-full transition-all duration-300 ease-in-out transform hover:scale-105 hidden lg:block"
            >
              Buscar
            </button>
          </Link>
  
        </div>
      </div>
    </div>
  );
  
};

export default FilterBox;
