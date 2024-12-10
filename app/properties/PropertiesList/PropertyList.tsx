"use client"
import React, { useEffect, useState } from 'react';
import { FaBed, FaBath, FaSquare } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Property } from '@/constant/constant';

const PropertyList: React.FC = () => {
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState<number>(0);
  const propertiesPerPage = 9;

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}?from=${from}&limit=${propertiesPerPage}&size=9`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data.properties);
        setTotalProperties(data.total);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchProperties();
  }, [from]);


  const handleClick = (propertyHash: string) => {
    if (!propertyHash) {
      console.error("Property hash is missing:", propertyHash);
      return;
    }
    router.push(`/properties/${propertyHash}`);
  };
  const handlePageChange = (page: number) => {
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

  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
    offset: 200,
  });
  AOS.refresh();

  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FCF3]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-[#95e7b5] border-solid"></div>
          <p className="text-xl text-gray-700">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fcf3] py-8 px-4 w-full">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleGoHome}
          className="hidden md:block px-4 py-2 bg-custom-green bg-opacity-75 text-white font-medium rounded-lg shadow-md hover:bg-custom-green hover:bg-opacity-90 transition duration-300 ease-in-out"
          data-aos="fade-in"
        >
          Volver al Inicio
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:block absolute top-4 left-4 w-[120px] h-[50px] md:w-[150px] md:h-[60px] rounded-lg overflow-hidden shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110"
          onClick={handleGoHome}
          >

          <img
            src="/images/logo-hero.png"
            alt="Logo de Olivera de Schwab"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#729c6b] to-[#4e7249] mb-12 uppercase tracking-wide shadow-md">
          PROPIEDADES EN VENTA O EN ALQUILER
        </h1>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.propertyHash}
              className="rounded-lg shadow-lg bg-custom-green bg-opacity-5 overflow-hidden cursor-pointer group relative h-[450px] sm:h-[500px] hover:scale-105 transition-all duration-300"
              onClick={() => handleClick(property.propertyHash)}
              data-aos="fade-in"
            >

              <div className="relative">
                <img
                  src={property.mainImage}
                  alt={property.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-all duration-300"
                />
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="group-hover:underline text-gray-900 font-bold text-lg truncate">{property.title}</h1>
                    <p className="text-base font-bold text-black bg-custom-green bg-opacity-20 py-1 px-3 rounded-lg shadow-md">
                      {property.price} {property.currency}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{property.address}</p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between space-x-6">
                      <div className="flex items-center space-x-2">
                        <FaBed className="text-custom-green text-xl" />
                        <p className="text-sm font-medium text-gray-700">{property.bedrooms} Dormitorios</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaBath className="text-custom-green text-xl" />
                        <p className="text-sm font-medium text-gray-700">{property.bathrooms} Baños</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaSquare className="text-custom-green text-xl" />
                        <p className="text-sm font-medium text-gray-700">{property.size} m²</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative mt-8 sm:mt-2 h-[30px] sm:h-[40px]">
                  <div className="w-full h-[1px] mt-8 bg-gray-300"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full bg-[#bcd1b7] px-4">
                    <h1 className="inline-block  bg-opacity-45 text-red-500 text-lg font-semibold px-4 py-2 rounded-full transition duration-300 ease-in-out">
                      {property.propertyOperation}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border ${currentPage === 1 ? 'bg-gray-400' : 'bg-[#729c6b]'} text-white transition duration-200`}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-2 rounded-md border ${currentPage === pageNumber
                ? 'bg-[#4e7249] text-white'
                : 'bg-[#729c6b] text-white'
                } hover:bg-[#5b8456] transition duration-200 hidden md:inline-block`}
            >
              {pageNumber}
            </button>
          ))}


          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border ${currentPage === totalPages ? 'bg-gray-400' : 'bg-[#729c6b]'} text-white transition duration-200`}
          >
            Siguiente
          </button>

        </div>
      </div>
    </div>
  );
};

export default PropertyList;
