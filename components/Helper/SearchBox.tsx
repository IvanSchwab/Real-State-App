import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
import Link from 'next/link';
import Fade from 'react-awesome-reveal';

interface Type {
  description: string;
  id: number;
}

export const useFetchData = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const typesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_TYPES}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        });

        if (!typesRes.ok) {
          throw new Error('Error fetching types data');
        }

        const typesData = await typesRes.json();
        setTypes(typesData.types || typesData);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { types, loading, error };
};

const SearchBox = () => {
  const { types } = useFetchData();
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [priceFrom, setPriceFrom] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [operation, setOperation] = useState<number | null>(null);
  const [searchQuery] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const operationOptions = [
    { id: 1, label: 'Venta' },
    { id: 2, label: 'Alquiler' },
  ];

  const buildQueryString = () => {
    const query: Record<string, string | number | null> = {
      type: selectedType,
      operation,
      bedrooms,
      priceFrom,
      priceTo,
      dateFrom,
      dateTo,
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
      <div className="relative w-full sm:hidden">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white font-semibold text-lg">Filtros</p>
          <button
            onClick={handleClick}
            className="text-white bg-[#dfc05a] p-2 rounded-md hover:bg-[#d8b542] transition-all duration-150"
          >
            <HiAdjustmentsHorizontal className="w-6 h-6" />
          </button>
        </div>
        {showAdvanced && (
          <Fade>
            <div className="absolute top-12 left-0 w-full bg-[#7C8F7C] p-4 rounded-lg shadow-lg z-10">
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
                className="w-full mb-2 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
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
                className="w-full mb-2 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
              >
                <option value="">Operación</option>
                {operationOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Habitaciones"
                className="w-full mb-2 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
                value={bedrooms || ''}
                onChange={(e) => setBedrooms(validateBedrooms(e.target.value))}
              />
              <input
                type="number"
                placeholder="Precio desde"
                className="w-full mb-2 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
                value={priceFrom || ''}
                onChange={(e) => setPriceFrom(validatePrice(e.target.value))}
              />
              <input
                type="number"
                placeholder="Precio hasta"
                className="w-full mb-2 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
                value={priceTo || ''}
                onChange={(e) => setPriceTo(validatePrice(e.target.value))}
              />
              <input
                type="date"
                className="w-full mb-2 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <input
                type="date"
                className="w-full bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </Fade>
        )}
      </div>

      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 w-full gap-4">
        <select
          value={selectedType || ''}
          onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
          className="w-[90%] h-10 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
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
          className="w-[90%] h-10 bg-[#A4B494] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
        >
          <option value="">Operación</option>
          {operationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Habitaciones"
          className="w-[90%] h-10 bg-[#A4B494] placeholder:text-[#ddecde] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
          value={bedrooms || ''}
          onChange={(e) => setBedrooms(validateBedrooms(e.target.value))}
        />
        <input
          type="number"
          placeholder="Precio Desde"
          className="w-[90%] h-10 bg-[#A4B494] placeholder:text-[#ddecde] text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
          value={priceFrom || ''}
          onChange={(e) => setPriceFrom(validatePrice(e.target.value))}
        />
        <input
          type="number"
          placeholder="Precio Hasta"
          className="w-[90%] h-10 bg-[#A4B494] text-[#ddecde] placeholder:text-[#ddecde] rounded-lg px-4 font-semibold focus:ring-2 focus:ring-[#E3C565]"
          value={priceTo || ''}
          onChange={(e) => setPriceTo(validatePrice(e.target.value))}
        />
        <Link href={`/properties?${buildQueryString()}`}>
          <button className="h-10 bg-[#dfc05a] hover:bg-[#d8b542] transition-all duration-150 text-white rounded-full sm:rounded-lg flex items-center justify-center px-6 col-span-2 md:col-span-1 ml-[30%]">
            <FaSearch className="text-white w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );

};


export default SearchBox;
