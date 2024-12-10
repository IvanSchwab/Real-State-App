"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PropertyData } from "@/constant/constant";
import Footer from "@/components/Home/Footer/Footer";

const PropertyDescription: React.FC = () => {
  const router = useParams();
  const propertyHash = router?.propertyHash || '';
  const [propertyDetails, setPropertyDetails] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyHash) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_HASH}${propertyHash}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data: PropertyData = await response.json();
        setPropertyDetails(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyHash]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-400">
        <p className="bold text-xl">Cargando detalles de la propiedad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!propertyDetails) {
    return (
      <div className="text-center">
        <p>No se encontraron detalles para esta propiedad.</p>
      </div>
    );
  }

  const {
    mainImage,
    title,
    price,
    address,
    descriptionFormatted,
    ambiences,
    sold,
    rented,
    propertyType,
    customerName,
    customerPhone,
    customerEmail,
    zone,
    zone1Desc,
    zone2Desc,
    zipCode,
    labels,
    images,
    currency,
  } = propertyDetails;


  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && propertyDetails?.images) {
      setSelectedImageIndex((prev) => (prev! + 1) % propertyDetails.images.length);
    }
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && propertyDetails?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? propertyDetails.images.length - 1 : prev! - 1
      );
    }
  };




  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-shrink-0 w-full md:w-1/3 h-64 relative rounded-md shadow-md overflow-hidden">
            <img
              src={`https://images.mapaprop.app/photos/${mainImage}`}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 md:mt-0 md:w-2/3 space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{title}</h1>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {currency} {price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-2">{address}</p>

            <div className="bg-gray-50 p-4 rounded-md shadow-inner">
              <h2 className="text-gray-800 font-semibold mb-1">Descripción de la Propiedad</h2>
              <p className="text-gray-700 leading-relaxed">{descriptionFormatted}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-6 rounded-md shadow-inner">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Información Adicional</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <p className="font-semibold">Ambientes</p>
              <p>{ambiences ? ambiences : '-'}</p>
            </div>
            <div>
              <p className="font-semibold">Tipo de propiedad</p>
              <p>{propertyType}</p>
            </div>
            <div>
              <p className="font-semibold">Propietario</p>
              <p>{customerName}</p>
            </div>
            <div>
              <p className="font-semibold">Teléfono</p>
              <p>{`+54 ${customerPhone}`}</p>
            </div>
           
            <div>
              <p className="font-semibold">Zona</p>
              <p>{zone} - {zone1Desc} - {zone2Desc}</p>
            </div>
            <div>
              <p className="font-semibold">Código Postal</p>
              <p>{zipCode ? zipCode : '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {rented && (
            <p className="text-green-600 font-semibold">Propiedad actualmente alquilada</p>
          )}
          {sold && (
            <p className="text-red-600 font-semibold">Propiedad vendida</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Galería de Imágenes</h2>
          {images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="w-full h-32 bg-gray-200 rounded-md overflow-hidden shadow-md cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={`https://images.mapaprop.app/photos/${img.image}`}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No hay imágenes disponibles para esta propiedad.</p>
          )}
        </div>

        {selectedImageIndex !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="relative flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white text-3xl"
                onClick={closeModal}
              >

                &times;
              </button>
              <button
                className="absolute left-4 text-white text-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-opacity-80 shadow-lg rounded-full px-4 py-2 hover:shadow-xl transition-transform transform hover:scale-105"
                onClick={handlePreviousImage}
              >
                &#8249;
              </button>
              <img
                src={`https://images.mapaprop.app/photos/${images[selectedImageIndex].image}`}
                alt={`Imagen ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full rounded-md shadow-lg"
              />

              <button
                className="absolute right-4 text-white text-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-opacity-80 shadow-lg rounded-full px-4 py-2 hover:shadow-xl transition-transform transform hover:scale-105"
                onClick={handleNextImage}
              >
                &#8250;
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default PropertyDescription;
