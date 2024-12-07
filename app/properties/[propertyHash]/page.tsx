"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PropertyData } from "@/constant/constant";

const ImageCarousel: React.FC<{ images: any[] }> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const imageUrls = images.map(image =>
    `https://images.mapaprop.app/photos/${image.image}`
);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {images.length > 0 && (
        <>
          <div className="absolute inset-0 transition-transform duration-500">
            <img
              src={imageUrls[currentImageIndex]}
              alt={`Imagen ${currentImageIndex + 1}`}
              className="object-cover"
            />
          </div>
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer"
            onClick={handlePrev}
          >
            ❮
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer"
            onClick={handleNext}
          >
            ❯
          </button>
        </>
      )}
    </div>
  );
};

const PropertyDescription: React.FC = () => {
  const router = useParams();
  const { propertyHash } = router;
  const [propertyDetails, setPropertyDetails] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando detalles de la propiedad...</p>
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
    description,
    ambiences,
    sold,
    rented,
    propertyType,
    customerName,
    images,
  } = propertyDetails;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Carrusel de imágenes */}
      {images?.length > 0 && <ImageCarousel images={images} />}

      {/* Detalles de la propiedad */}
      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg font-semibold text-gray-700 mb-2">Precio: ${price}</p>
        <p className="text-sm text-gray-600 mb-2">{address}</p>
        <p className="text-gray-700 mb-4">{description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-gray-700">
          <p><strong>Ambientes:</strong> {ambiences}</p>
          <p><strong>Tipo de propiedad:</strong> {propertyType}</p>
          <p><strong>Propietario:</strong> {customerName}</p>
        </div>

        {/* Estado de la propiedad */}
        <div className="mt-2">
          {rented && <p className="text-green-600">Propiedad actualmente alquilada</p>}
          {sold && <p className="text-red-600">Propiedad vendida</p>}
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;
