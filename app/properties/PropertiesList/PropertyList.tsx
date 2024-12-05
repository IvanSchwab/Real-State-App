"use client"
import React, { useEffect, useState } from 'react';
import { FaBed, FaBath, FaSquare } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image'; 

interface Image {
  image: string;
  thumbnail: string;
  orientation: number;
  imageId: number;
  main: boolean;
  type: number;
  contentType: string;
  order: number;
  timestamp: string;
}

interface Property {
  title: string;
  id: number;
  name: string;
  zipCode: string;
  country: string;
  county: string;
  city: string;
  state: string;
  price: number;
  description: string;
  descriptionFormatted: string;
  propertyOperation: string;
  images: Image[];
  address: string;
  propertyType: string;
  currency: string;
  mainImage: string;
  location: {
    lon: string;
    lat: string;
  };
  rented: boolean;
  sold: boolean;
  lastUpdate: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  contract: string;
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [from, setFrom] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setFrom((prev) => prev + propertiesPerPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setFrom((prev) => Math.max(prev - propertiesPerPage, 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClick = (id: number) => {
    router.push(`/properties/${id}`);
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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-[#95e7b5] border-solid"></div>
          <p className="text-xl text-gray-700">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fcf3] py-8 px-4 w-full">
      <div className="max-w-6xl mx-auto">
      <div className="absolute top-4 left-4 w-[120px] h-[50px] md:w-[150px] md:h-[60px] rounded-lg overflow-hidden shadow-xl" onClick={handleGoHome}>
                <img
                    src="/images/logo-hero.png"
                    alt="Logo de Olivera de Schwab"
                    className="object-cover w-full h-full rounded-lg"
                />
            </div>
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-12">PROPIEDADES EN VENTA O EN ALQUILER</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="rounded-lg shadow-lg overflow-hidden cursor-pointer group relative h-[450px] sm:h-[500px] hover:scale-105 transition-all duration-300"
              onClick={() => handleClick(property.id)}
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
                    <p className="text-base font-bold text-black bg-gray-200 py-1 px-3 rounded-lg shadow-md">
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
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#f8fcf3] px-4">
                    <h1 className="text-rose-600 text-lg font-semibold">{property.propertyOperation}</h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 space-x-6">
          <button
            onClick={handlePreviousPage}
            className="px-6 py-3 bg-[#789b61] text-white rounded-lg shadow-md hover:bg-[#6f8d4f] transition-colors duration-300"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-xl text-gray-700 translate-y-[8px]">{currentPage} de {totalPages}</span>
          <button
            onClick={handleNextPage}
            className="px-6 py-3 bg-[#789b61] text-white rounded-lg shadow-md hover:bg-[#6f8d4f] transition-colors duration-300"
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;