import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import SearchCode from '../../../components/common/SearchCode';
import Image from 'next/image';

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
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!apiUrl || !apiKey) {
        console.error('Missing API configuration');
        setError('Missing API configuration');
        setLoading(false);
        return;
      }

      try {
        const [typesRes, zonesRes] = await Promise.all([
          fetch(`${apiUrl}types?oauth_token=${apiKey}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          }),
          fetch(`${apiUrl}zones?oauth_token=${apiKey}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
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
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
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
  const [searchQuery] = useState<string>('');

  const router = useRouter();

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
      .filter(([, value]) => value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return queryString;
  };

  const handleSearchClick = () => {
    const queryString = buildQueryString();
    router.push(`/properties?${queryString}`);
  };

  return (
    <div className="fixed w-full ">
      <div className="top-0 pt-2 w-full bg-[#94b190] shadow-xl rounded-b-lg">
        <Link href="/">
          <div className="hidden w-48 h-20 xl:block absolute top-2 left-4 rounded-lg overflow-hidden shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110">
            <Image
              src="/images/logo-hero.png"
              alt="Logo de Olivera de Schwab"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          <div className="hidden lg:flex xl:hidden absolute top-4 left-4 cursor-pointer text-3xl">
            <FaCircleArrowLeft />
          </div>
        </Link>
        <div className="pt-5 pl-2 z-40 max-w-10 max-h-10 absolute top-2 right-14 md:right-20 lg:right-24 cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110 ">
          <SearchCode />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-4 ">
          <div className="flex items-center w-full lg:hidden">
            <Image
              src="/images/logo-hero.png"
              alt="Logo"
              width={160}
              height={160}
              className="object-cover shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110 rounded-lg"
            />
            <div className="pl-2">
              <div className="flex items-center pb-2 pr-20 justify-between w-full ">
                <h2 className="text-xl font-semibold text-white mr-3">Filtrar</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 mr-7 text-white bg-custom-green rounded-lg hover:bg-opacity-80 transition-all duration-300 ease-in-out w-9 text-center"
                >
                  <FaFilter className="text-xl" />
                </button>
              </div>
            </div>
          </div>

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

            <div className="lg:w-64 ">
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
                onChange={(e) =>
                  setPriceTo(Math.max(0, Number(e.target.value)))
                }
                className="w-full mt-1 bg-white text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none shadow-sm hover:bg-gray-50 transition-all duration-300 ease-in-out"
                placeholder="Valor"
                min="0"
              />
            </div>
          </div>

          {isMobileMenuOpen && (
            <button
              onClick={handleSearchClick}
              className="px-4 py-3 bg-custom-green mt-6 text-white rounded-lg hover:bg-opacity-80 w-full transition-all duration-300 ease-in-out transform hover:scale-105 block lg:hidden"
            >
              Buscar
            </button>
          )}

          <button
            onClick={handleSearchClick}
            className="px-4 py-3 bg-custom-green mt-6 text-white rounded-lg hover:bg-opacity-80 w-full transition-all duration-300 ease-in-out transform hover:scale-105 hidden lg:block"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
