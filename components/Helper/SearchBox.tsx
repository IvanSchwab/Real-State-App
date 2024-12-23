import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
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


const SearchBox = () => {
  const { types, zones } = useFetchData();
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [priceFrom, setPriceFrom] = useState<number | null>(null);
  const [operation, setOperation] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  const [searchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const operationOptions = [
    { id: 1, label: 'Venta' },
    { id: 2, label: 'Alquiler' },
  ];

  const buildQueryString = () => {
    const query: Record<string, string | number | null> = {
      type: selectedType,
      zone1: selectedZone,
      zone2: selectedCounty,
      operation,
      bedrooms,
      priceFrom,
      priceTo,
      query: searchQuery,
    };

    const queryString = Object.entries(query)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return queryString;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAdvanced(!showAdvanced);
  };
  const validateBedrooms = (value: string | number): number | null => {
    const num = Number(value);
    return num >= 0 && num <= 8 ? num : bedrooms;
  };

  const validatePrice = (value: string | number): number | null => {
    const num = Number(value);
    return num >= 0 && num <= 100000000 ? num : null;
  };
  return (
    <div className="w-[90%] mx-auto bg-[#7c8f7c] h-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center rounded-lg shadow-lg gap-4">
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 w-full gap-4">
        <select
          value={selectedType || ''}
          onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
        >
          <option value="">Tipo</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.description}
            </option>
          ))}
        </select>

        <select
          value={operation || ''}
          onChange={(e) => setOperation(e.target.value ? Number(e.target.value) : null)}
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
        >
          <option value="">Operación</option>
          {operationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          id="zone"
          value={selectedZone || ''}
          onChange={(e) => setSelectedZone(Number(e.target.value))}
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
        >
          <option value="">Zona</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.description}
            </option>
          ))}
        </select>

        <select
          id="county"
          value={selectedCounty || ''}
          onChange={(e) => setSelectedCounty(Number(e.target.value))}
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
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

        <input
          type="number"
          placeholder="Habitaciones"
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] placeholder:text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
          value={bedrooms || ''}
          onChange={(e) => setBedrooms(validateBedrooms(e.target.value))}
        />

        <input
          type="number"
          placeholder="Precio Hasta"
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] placeholder:text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
          value={priceTo || ''}
          onChange={(e) => setPriceTo(validatePrice(e.target.value))}
        />
      </div>

      <div className="sm:hidden w-full">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
        >
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>



        {showFilters && (
          <div className="w-full mt-4 flex flex-col gap-4">
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
              className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
            >
              <option value="">Tipo</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.description}
                </option>
              ))}
            </select>

            <select
              value={operation || ''}
              onChange={(e) => setOperation(e.target.value ? Number(e.target.value) : null)}
              className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
            >
              <option value="">Operación</option>
              {operationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              id="zone"
              value={selectedZone || ''}
              onChange={(e) => setSelectedZone(Number(e.target.value))}
              className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
            >
              <option value="">Zona</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.description}
                </option>
              ))}
            </select>

            <select
              id="county"
              value={selectedCounty || ''}
              onChange={(e) => setSelectedCounty(Number(e.target.value))}
              className="w-full h-12 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
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

            <input
              type="number"
              placeholder="Habitaciones"
              className="w-full h-12 bg-[#A4B494] text-[#ddecde] placeholder:text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
              value={bedrooms || ''}
              onChange={(e) => setBedrooms(validateBedrooms(e.target.value))}
            />

            <input
              type="number"
              placeholder="Precio Hasta"
              className="w-full h-12 bg-[#A4B494] text-[#ddecde] placeholder:text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565] transition-all duration-150"
              value={priceTo || ''}
              onChange={(e) => setPriceTo(validatePrice(e.target.value))}
            />
          </div>
        )}
      </div>


      {showFilters && (
  <div className="w-full mt-4 flex flex-col gap-4 items-center justify-center">
    <Link href={`/properties?${buildQueryString()}`}>
      <button className="h-12 bg-[#dfc05a] hover:bg-[#d8b542] transition-all duration-150 text-white rounded-full sm:rounded-lg items-center justify-center px-6">
        Buscar
      </button>
    </Link>
  </div>
)}


      <Link href={`/properties?${buildQueryString()}`}>
        <button className="h-12 bg-[#dfc05a] hover:bg-[#d8b542] transition-all duration-150 text-white rounded-full sm:rounded-lg  items-center justify-center px-6 ml-4 hidden sm:block">
          <FaSearch className="text-white w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default SearchBox;
