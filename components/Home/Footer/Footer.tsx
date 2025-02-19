import React from 'react';
import { FaFacebook, FaInstagram, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-700 text-gray-400 py-6 relative">
            <div className="container mx-auto px-4 flex flex-col items-center space-y-6">
                <p className="text-xs md:text-sm text-center max-w-4xl px-2 select-none">
                    Las medidas indicadas son aproximadas y se confirmarán en el título de propiedad de cada inmueble. Las fotos, imágenes y videos son ilustrativos y no tienen carácter contractual. Los precios son orientativos y pueden estar sujetos a cambios.
                </p>

                <div className="flex flex-col items-center space-y-4 w-full">
                    <p className="text-lg text-white font-semibold select-none">Contáctanos</p>

                    <div className="flex space-x-4 md:space-x-6 justify-center">
                        <a href="https://www.instagram.com/oliveradeschwab/?hl=es-la" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-white text-xl md:text-2xl hover:text-purple-400 transition duration-300" />
                        </a>
                        <a href="https://www.facebook.com/p/Olivera-De-Schwab-Propiedades-100064059664407/?locale=es_LA" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-white text-xl md:text-2xl hover:text-blue-600 transition duration-300" />
                        </a>
                        <a href="https://wa.me/5491164566539" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="text-white text-xl md:text-2xl hover:text-green-500 transition duration-300" />
                        </a>
                    </div>

                    <div className="flex flex-col md:flex-row md:space-x-6 items-center space-y-2 md:space-y-0">
                        <p className="text-white text-sm flex items-center space-x-2">
                            <FaPhoneAlt className="text-green-400" />
                            <span>+54 9 11 6456-6539</span>
                        </p>
                        <p className="text-white text-sm text-center">
                            Dirección: C. Lincoln 3598, San Martín
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                    <p className="select-none text-sm text-center">
                        © {currentYear} Olivera de Schwab Propiedades.
                    </p>
                    <p className="select-none text-xs text-center">
                        Software realizado por: {' '}
                        <a href="https://ivanschwabdev.vercel.app/" target="_blank" className="text-blue-500 hover:underline">
                            Iván Schwab
                        </a>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-4 w-full">
                    <div className="w-28 md:w-32 h-12 md:h-14 rounded-lg overflow-hidden shadow-xl">
                        <img
                            src="/images/logo-hero.png"
                            alt="Logo de Olivera de Schwab"
                            className="object-cover w-full h-full rounded-lg"
                        />
                    </div>
                    <div className="w-28 md:w-32 h-12 md:h-14">
                        <img
                            src="/images/colegio-martilleros.png"
                            alt="Colegio de Martilleros"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
