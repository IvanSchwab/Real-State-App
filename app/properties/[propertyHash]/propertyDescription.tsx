"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PropertyData } from "@/constant/constant";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

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
      document.body.style.overflow = 'hidden';
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}properties/${propertyHash}`,
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
        document.body.style.overflow = 'auto';
      }
    };

    fetchPropertyDetails();
  }, [propertyHash]);

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
    zone1Desc,
    zone2Desc,
    zipCode,
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

  const handleShare = () => {
    const propertyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${propertyHash}`;
    const message = `¡Mira esta propiedad que encontré!\n${title}\nPrecio: ${currency} ${price.toLocaleString()}\nDirección: ${address}\n${propertyLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContact = () => {
    const propertyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${propertyHash}`;
    const message = `Estoy interesado en esta propiedad: \n${title}\nPrecio: ${currency} ${price.toLocaleString()}\nDirección: ${address}\n${propertyLink}`;
    const whatsappUrl = `https://wa.me/5491164566539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Link href="/">
        <div className="hidden 2xl:block 2xl:w-[10%] 2xl:h-[8%] absolute top-2 left-4 rounded-lg overflow-hidden shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110">
          <img
            src="/images/logo-hero.png"
            alt="Logo de Olivera de Schwab"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </Link>
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

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleShare}
                className="flex items-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200 shadow-lg"
              >
                <FaWhatsapp className="w-6 h-6 mr-2" />
                Compartir en WhatsApp
              </button>

              <button
                onClick={handleContact}
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50 transition-all duration-300 transform hover:scale-105"
                aria-label="Contactar por WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.383 0 0 5.383 0 12c0 2.12.555 4.185 1.607 6.003L0 24l6.118-1.577A11.91 11.91 0 0 0 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm-.005 21.157a9.089 9.089 0 0 1-4.82-1.384l-.344-.21-3.638.938.972-3.541-.225-.35A9.092 9.092 0 0 1 2.914 12 9.09 9.09 0 1 1 11.995 21.157zm4.958-5.652c-.247-.123-1.464-.721-1.69-.802-.226-.08-.39-.123-.555.124-.164.246-.637.802-.78.966-.142.164-.29.184-.537.062-.248-.123-1.05-.391-2-1.248-.738-.633-1.237-1.418-1.382-1.664-.144-.247-.015-.38.108-.503.111-.11.247-.29.371-.435.124-.145.165-.247.247-.412.082-.165.041-.31-.02-.434-.062-.123-.555-1.335-.76-1.83-.2-.483-.403-.418-.555-.428-.144-.012-.31-.012-.475-.012s-.435.062-.664.31c-.227.247-.866.846-.866 2.065 0 1.218.888 2.392 1.011 2.557.124.165 1.752 2.671 4.259 3.745.596.257 1.062.411 1.424.527.599.19 1.146.164 1.58.1.482-.073 1.464-.601 1.67-1.182.206-.581.206-1.079.145-1.182-.062-.103-.226-.165-.474-.289z" />
                </svg>
              </button>
            </div>
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
              <p>{zone1Desc} - {zone2Desc}</p>
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
                  className="w-full h-32 bg-gray-200 rounded-md overflow-hidden shadow-md cursor-pointer "
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
              {/* Botón de cerrar */}
              <button
                className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                onClick={closeModal}
              >
                &times;
              </button>

              {/* Botón de imagen anterior */}
              <button
                className="absolute left-4 text-white text-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-opacity-80 shadow-lg rounded-full px-4 py-2 hover:shadow-xl transition-transform transform hover:scale-105"
                onClick={handlePreviousImage}
              >
                &#8249;
              </button>

              {/* Imagen con tamaño máximo */}
              <img
                src={`https://images.mapaprop.app/photos/${images[selectedImageIndex].image}`}
                alt={`Imagen ${selectedImageIndex + 1}`}
                className="max-w-[90vw] max-h-[80vh] w-auto h-auto rounded-md shadow-lg"
              />

              {/* Botón de imagen siguiente */}
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

    </div>
  );
}

export default PropertyDescription;
