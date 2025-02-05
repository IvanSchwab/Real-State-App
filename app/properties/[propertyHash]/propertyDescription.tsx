"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { PropertyData } from "@/constant/constant";
import ImageGallery from "./ImageGallery";
import { FaInfoCircle, FaAlignLeft, FaCheckCircle, FaTimesCircle, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser, FaBuilding, FaHome, FaWhatsapp, FaFacebook, FaLinkedin, FaImages } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const PropertyDescription: React.FC = () => {
  const router = useParams();
  const propertyHash = router?.propertyHash || '';
  const [propertyDetails, setPropertyDetails] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

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
    code,
    rented,
    propertyType,
    customerName,
    customerPhone,
    zone1Desc,
    zone2Desc,
    zipCode,
    propertyOperation,
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

  const handleFacebookShare = () => {
    const propertyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${propertyHash}`;
    const message = `¡Mira esta propiedad que encontré! ${title} - ${currency} ${price.toLocaleString()} - ${propertyLink}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyLink)}&quote=${encodeURIComponent(message)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const propertyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${propertyHash}`;
    const message = `¡Mira esta propiedad que encontré! ${title} - ${currency} ${price.toLocaleString()} - ${propertyLink}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleLinkedInShare = () => {
    const propertyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${propertyHash}`;
    const message = `¡Mira esta propiedad que encontré! ${title} - ${currency} ${price.toLocaleString()} - ${propertyLink}`;
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(propertyLink)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(message)}`;
    window.open(linkedinUrl, '_blank');
  };



  const handleContact = () => {
    const propertyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${propertyHash}`;
    const message = `Estoy interesado en esta propiedad: \n${title}\nPrecio: ${currency} ${price.toLocaleString()}\nDirección: ${address}\n${propertyLink}`;
    const whatsappUrl = `https://wa.me/5491164566539?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImgSize({ width, height });
      setIsMagnifierActive(true);
    }
  };

  const handleMouseLeave = () => {
    setIsMagnifierActive(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setCursorPosition({ x, y });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
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

      <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className=" text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900  flex items-center justify-center space-x-2">
          <i className="fas fa-home text-purple-600"></i>
        </h1>

        <div className="flex flex-col md:flex-row md:space-x-8">
          <div
            className="flex-shrink-0 w-full md:w-1/2 h-96 relative cursor-zoom-in rounded-md shadow-md overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imgRef}
              src={`https://images.mapaprop.app/photos/${mainImage}`}
              alt={title}
              onClick={() => openModal(0)}
              className="w-full h-full object-cover"
            />

            {isMagnifierActive && mainImage && (
              <div
                className="absolute border-2 border-white rounded-sm pointer-events-none"
                style={{
                  left: `${cursorPosition.x - 140}px`,
                  top: `${cursorPosition.y - 100}px`,
                  width: '280px',
                  height: '200px',
                  backgroundImage: `url('https://images.mapaprop.app/photos/${mainImage}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${imgSize.width * 2}px ${imgSize.height * 2}px`,
                  backgroundPosition: `-${cursorPosition.x * 2 - 100}px -${cursorPosition.y * 2 - 100}px`,
                  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                }}
              />
            )}
          </div>

          <div className="mt-6 bg-gray-50 p-6 rounded-md shadow-inner w-full md:w-1/2 border border-transparent hover:border-blue-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaImages className="text-blue-500 mr-2" />
              Galería de Imágenes
            </h2>

            <ImageGallery
              images={propertyDetails.images.map((image) => image.image)}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={openModal}
              onNextImage={handleNextImage}
              onPreviousImage={handlePreviousImage}
              onCloseModal={closeModal}
            />
          </div>
        </div>

        <div className="mt-8">
          {rented && (
            <p className="text-green-600 font-semibold flex items-center">
              <FaCheckCircle className="mr-2" />
              Propiedad actualmente alquilada
            </p>
          )}
          {sold && (
            <p className="text-red-600 font-semibold flex items-center">
              <FaTimesCircle className="mr-2" />
              Propiedad vendida
            </p>
          )}
          <div className="bg-gray-50 p-6 rounded-md shadow-inner hover:shadow-lg transition-all duration-300 border border-transparent hover:border-indigo-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaInfoCircle className="text-indigo-500" />
              <span>Información de la Propiedad</span>
            </h2>
            <h2 className="flex items-center space-x-4 text-2xl font-bold text-gray-800 mb-4">
              <span className="w-1 h-6 bg-indigo-500"></span>
              <span>
                {currency} {price.toLocaleString()}
              </span>
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              <span className="mb-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-500 italic">{zone1Desc} - {zone2Desc}</span>
              <span
                className={`mb-2 px-3 py-1 rounded-full text-sm font-medium ${propertyOperation === "Venta" ? "bg-green-100 text-green-700" : "bg-green-100 text-green-500"}`}
              >
                Propiedad en
                <span className="ml-1">{propertyOperation}</span>
              </span>
              <span className="mb-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600 italic">{code}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
              <div className="flex items-center space-x-2">
                <FaHome className="text-gray-500" />
                <div>
                  <p className="font-semibold">Ambientes</p>
                  <p>{ambiences || '-'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaBuilding className="text-gray-500" />
                <div>
                  <p className="font-semibold">Tipo de propiedad</p>
                  <p>{propertyType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="font-semibold">Propietario</p>
                  <p>{customerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-gray-500" />
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p>{`+54 ${customerPhone}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <div>
                  <p className="font-semibold">Dirección</p>
                  <p>
                    {address}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-500" />
                <div>
                  <p className="font-semibold">Código Postal</p>
                  <p>{zipCode || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-md shadow-inner hover:shadow-lg transition-all duration-300 border border-transparent hover:border-green-500 mt-6">
            <h2 className="text-gray-800 font-semibold mb-2 flex items-center space-x-2">
              <FaAlignLeft className="text-green-500" />
              <span>Descripción de la Propiedad</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">{descriptionFormatted}</p>
          </div>

          <div className="mt-6">


            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={handleShare}
                className="flex items-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200 shadow-lg"
              >
                <FaWhatsapp className="w-6 h-6 mr-2" />
                Compartir en WhatsApp
              </button>

              <button
                onClick={handleFacebookShare}
                className="flex items-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg"
              >
                <FaFacebook className="w-6 h-6 mr-2" />
                Compartir en Facebook
              </button>

              <button
                onClick={handleTwitterShare}
                className="flex items-center bg-black text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200 shadow-lg"
              >
                <FaXTwitter className="w-6 h-6 mr-2" />
                Compartir en Twitter
              </button>

              <button
                onClick={handleLinkedInShare}
                className="flex items-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 shadow-lg"
              >
                <FaLinkedin className="w-6 h-6 mr-2" />
                Compartir en LinkedIn
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>

  );
}

export default PropertyDescription;
