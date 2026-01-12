"use client"
import React, { useEffect, useState } from 'react';
import { FaBed, FaBath, FaSquare, FaSadTear } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { Property } from '@/constant/constant';
import FilterBox from '@/app/properties/list/FilterBox';
import Image from 'next/image';

const PropertyList: React.FC = () => {
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setFrom] = useState<number>(0);
  const propertiesPerPage = 9;

  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams?.get("type") ?? "";
  const operation = searchParams?.get("operation") ?? "";
  const bedrooms = searchParams?.get("bedrooms") ?? "";
  const priceTo = searchParams?.get("priceTo") ?? "";
  const zone1 = searchParams?.get("zone1") ?? "";
  const zone2 = searchParams?.get("zone2") ?? "";

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);


  useEffect(() => {
    const pageFromQuery = searchParams?.get("page");
    const pageNumber = pageFromQuery ? parseInt(pageFromQuery, 10) : 1;

    setCurrentPage(pageNumber);
    setFrom((pageNumber - 1) * propertiesPerPage);

    const fetchProperties = async () => {
      setLoading(true);
      document.body.style.overflow = 'hidden';

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!apiUrl || !apiKey) {
        console.error('Missing API configuration');
        setError('Missing API configuration');
        setLoading(false);
        document.body.style.overflow = 'auto';
        return;
      }

      try {
        const queryString = new URLSearchParams({
          size: '9',
          from: ((pageNumber - 1) * propertiesPerPage).toString(),
          limit: propertiesPerPage.toString(),
          ...(operation && { operation }),
          ...(type && { type }),
          ...(bedrooms && { bedrooms }),
          ...(priceTo && { priceTo }),
          ...(zone1 && { zone1 }),
          ...(zone2 && { zone2 }),
        }).toString();

        const response = await fetch(
          `${apiUrl}properties?${queryString}&oauth_token=${apiKey}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error('Error fetching properties:', response.statusText);
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data.properties);
        setTotalProperties(data.total);

      } catch (err) {
        if (err instanceof Error) {
          console.error('Fetch error:', err.message);
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
        document.body.style.overflow = 'auto';
      }
    };

    fetchProperties();
  }, [searchParams, type, operation, zone1, zone2, bedrooms, priceTo]);


  const handleClick = (event: React.MouseEvent<HTMLDivElement>, propertyHash: string) => {
    if (!propertyHash) {
      console.error("Property ID is missing:", propertyHash);
      return;
    }

    const url = `/properties/${propertyHash}`;

    if (event.button === 1) {
      window.open(url, "_blank");
      event.preventDefault();
    } else if (event.ctrlKey || event.metaKey) {
      window.open(url, "_blank");
    } else if (router && router.push) {
      router.push(url);
    } else {
      console.error("Router is not initialized");
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
    setLoading(true);
    setCurrentPage(page);
    setFrom((page - 1) * propertiesPerPage);

    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.body.style.overflow = '';
    }, 0);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FCF3]">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-[#7c8f7c] border-solid"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-pulse rounded-full h-16 w-16 bg-[#A4B494] opacity-40"></div>
            </div>
          </div>
          <p className="text-xl font-medium text-gray-700 animate-pulse">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute z-50">
        <FilterBox />
      </div>
      <div className="bg-[#f8fcf3] pt-32 md:pt-44 px-4 w-full min-h-[64vh]  items-center justify-center">
        {properties.length === 0 && (
          <div className="flex items-center justify-center text-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mt-24">
                <FaSadTear className="text-6xl text-gray-500" />
              </div>
              <div className="text-xl mt-12">
                No se encontraron propiedades con los filtros seleccionados.
              </div>
              <button
                onClick={handleGoHome}
                className="mt-6 px-4 py-2 bg-custom-green text-white font-medium rounded-lg shadow-md hover:bg-custom-green hover:bg-opacity-90 transition duration-300 ease-in-out"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.propertyHash}
                className="rounded-lg shadow-lg hover:shadow-2xl bg-custom-green bg-opacity-5 overflow-hidden cursor-pointer group relative h-[450px] sm:h-[500px] hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                onMouseDown={(event) => handleClick(event, property.propertyHash)}
              >
                <div className="relative">
                  <div className="w-full h-56 relative overflow-hidden">
                    <Image
                      src={property.mainImage}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-all duration-500"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h1 className="group-hover:underline text-gray-900 font-bold text-lg truncate transition-all duration-300">{property.title}</h1>
                      <p className="text-base font-bold text-black bg-custom-green bg-opacity-20 py-1 px-3 rounded-lg shadow-md group-hover:bg-opacity-30 group-hover:scale-105 transition-all duration-300">
                        {property.price} {property.currency}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 transition-all duration-300">{property.address}</p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between space-x-6">
                        <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                          <FaBed className="text-custom-green text-xl group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-sm font-medium text-gray-700">{property.bedrooms} Dormitorios</p>
                        </div>
                        <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                          <FaBath className="text-custom-green text-xl group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-sm font-medium text-gray-700">{property.bathrooms} Baños</p>
                        </div>
                        <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                          <FaSquare className="text-custom-green text-xl group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-sm font-medium text-gray-700">{property.landArea} m²</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-8 sm:mt-2 h-[30px] sm:h-[40px]">
                    <div className="w-full h-[1px] mt-8 bg-gray-300"></div>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full bg-[#bcd1b7] px-4 group-hover:scale-110 transition-all duration-300">
                      <h1 className="inline-block bg-opacity-45 text-red-500 text-lg font-semibold px-4 py-2 rounded-full">
                        {property.propertyOperation}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-8 space-x-2">
            {properties.length > 0 && (
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md border font-medium ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#729c6b] hover:bg-[#5b8456] hover:scale-105'} text-white transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                Anterior
              </button>
            )}

            {properties.length > 0 && Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-2 rounded-md border font-medium ${currentPage === pageNumber
                  ? 'bg-[#4e7249] pointer-events-none text-white scale-110 shadow-lg'
                  : 'bg-[#729c6b] text-white hover:scale-105'
                  } hover:bg-[#5b8456] transition-all duration-300 hidden md:inline-block shadow-md`}
              >
                {pageNumber}
              </button>
            ))}

            {properties.length > 0 && (
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md border font-medium ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#729c6b] hover:bg-[#5b8456] hover:scale-105'} text-white transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyList;
