"use client";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsappButton: React.FC = () => {
  const handleClick = () => {
    window.open("https://wa.me/5491164566539", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50 transition-all duration-300 transform hover:scale-105"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className="w-10 h-10" />
    </button>
  );
};

export default WhatsappButton;
