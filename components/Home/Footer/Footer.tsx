import React from 'react';
import { FaFacebook, FaInstagram, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-700 text-gray-400 py-6 relative">
            <div className="container mx-auto flex flex-col items-center space-y-6">

                <p className="text-xs text-center select-none">
                    Las medidas indicadas son aproximadas y se confirmarán en el título de propiedad de cada inmueble. Las fotos, imágenes y videos son ilustrativos y no tienen carácter contractual. Los precios son orientativos y pueden estar sujetos a cambios.
                </p>

                <div className="flex flex-col items-center space-y-4">
                    <p className="text-lg text-white font-semibold select-none">Contáctanos</p>
                    <div className="flex space-x-6">
                        <a href="https://www.instagram.com/oliveradeschwab/?hl=es-la" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-white text-2xl hover:text-purple-400 transition duration-300" />
                        </a>
                        <a href="https://www.facebook.com/p/Olivera-De-Schwab-Propiedades-100064059664407/?locale=es_LA" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-white text-2xl hover:text-blue-600 transition duration-300" />
                        </a>
                        <a href="https://wa.me/5491164566539" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="text-white text-2xl hover:text-green-500 transition duration-300" />
                        </a>
                    </div>
                    <p className="text-white text-sm flex items-center space-x-2">
                        <FaPhoneAlt className="text-green-400" />
                        <span>+54 9 11 6456-6539</span>
                    </p>
                    <p className="text-white text-sm">
                        Dirección: C. Lincoln 3598, San Martín
                    </p>
                </div>

                <p className="select-none text-sm mb-4 text-center">
                    © 2024 Olivera de Schwab Propiedades.
                </p>

                <p className="select-none text-xs text-center">
                    Software realizado por: <a href="https://github.com/IvanSchwab" target="_blank" className="text-blue-500 hover:underline">
                        Iván Schwab
                    </a>
                </p>

            </div>

            <div className="absolute bottom-4 left-4 w-[120px] h-[50px] md:w-[150px] md:h-[60px] rounded-lg overflow-hidden shadow-xl">
                <img
                    src="/images/logo-hero.png"
                    alt="Logo de Olivera de Schwab"
                    className="object-cover w-full h-full rounded-lg"
                />
            </div>
            <div className="absolute bottom-4 right-4 w-[120px] h-[60px] md:w-[150px] md:h-[70px]">
                <img
                    src="/images/colegio-martilleros.png"
                    alt="Colegio de Martilleros"
                    className="object-contain w-full h-full"
                />
            </div>
        </footer>
    );
};

export default Footer;
