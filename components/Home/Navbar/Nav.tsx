"use client";
import { navLinks } from '@/constant/constant';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { HiBars3BottomRight } from 'react-icons/hi2';

type Props = {
    openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
    const [navBg, setNavBg] = useState(false);

    useEffect(() => {
        const handler = () => {
            if (window.scrollY >= 90) setNavBg(true);
            if (window.scrollY < 90) setNavBg(false);
        };

        window.addEventListener("scroll", handler);
        return () => {
            window.removeEventListener("scroll", handler);
        };
    }, []);

    return (
        <div className={`fixed h-[10vh] z-[100] w-full  transition-all duration-500 ease-in-out ${navBg ? 'bg-custom-green' : 'bg-transparent'}`}>
            {/* Contenedor principal de la navbar */}
            <div className="flex items-center h-[80%] mt-2 justify-between w-[95%] sm:w-[90%] md:w-[85%] xl:w-[80%] mx-auto">
                {/* Logo */}
                <div className={`bg-[#77a579] opacity-65 p-2 sm:ml-2 transition-opacity duration-500 ${navBg ? 'opacity-90' : 'opacity-50'} rounded-md max-w-xs shadow-md mx-auto sm:ml-[-50px] md:ml-[-20px]`}>
                    <img
                        src="/images/logo-background.png"
                        alt="Logo"
                        className="object-cover w-full h-[52px] rounded-md"
                    />
                </div>

                {/* Sección de enlaces de navegación */}
                <div className="lg:flex items-center justify-center space-x-6 text-white hidden flex-grow transition-transform md:space-x-8 transform translate-x-[-4%]">
                    {navLinks.map((navlink) => (
                        <Link key={navlink.id} href={navlink.url}>
                            <p className={`select-none font-medium text-white border-2 px-6 py-3 rounded-lg 
                                ${navBg ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent'} 
                                hover:bg-gray-300/30 hover:text-white hover:shadow-md hover:border-[#4d624d] 
                                transition-all duration-200 ease-in-out whitespace-nowrap`}>
                                {navlink.label}
                            </p>


                        </Link>
                    ))}
                </div>


                {/* Menú de hamburguesa */}
                <div className="flex items-center space-x-4">
                    <HiBars3BottomRight
                        onClick={openNav}
                        className="sm:w-8 sm:h-8 w-6 h-6 cursor-pointer text-white lg:hidden md:w-7 md:h-7"
                    />
                </div>
            </div>
        </div>
    );
};

export default Nav;
