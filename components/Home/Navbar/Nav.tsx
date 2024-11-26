"use client";
import { navLinks } from '@/constant/constant';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { HiBars3BottomRight } from 'react-icons/hi2'

type Props = {
    openNav: () => void;
}

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
        <div className={`fixed h-[10vh] z-[100] w-full transition-all duration-500 ease-in-out ${navBg ? 'bg-custom-green' : 'bg-transparent'}`}>
            {/* Contenedor principal de la navbar */}
            <div className="flex items-center h-full justify-between w-[95%] sm:w-[90%] xl:w-[80%] mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <div className="md:w-10 md:h-10 w-7 h-7 rounded-full bg-[#E3C565] text-white flex items-center shadow-md justify-center flex-col">
                        <FaHouse />
                    </div>
                    <h1 className="text-white select-none font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide relative">
                        Olivera de Schwab
                        <span className="select-none absolute left-[0.8%] sm:left-[0.8%] top-[80%] sm:top-[70%] text-xs sm:text-sm md:text-base font-normal text-gray-300">
                            Propiedades
                        </span>
                    </h1>
                </div>

                {/* Sección de enlaces de navegación */}
                <div className="lg:flex items-center space-x-14 text-white hidden flex-grow justify-center transform xl:-translate-x-[105px]">
                    {navLinks.map((navlink) => {
                        return (
                            <Link key={navlink.id} href={navlink.url}>
                                <p
                                    className={`select-none font-medium text-white border-2 px-6 py-3 rounded-lg 
                                    ${navBg ? 'bg-[#647C64] border-[#647C64]' : 'bg-transparent border-transparent'} 
                                    hover:bg-gray-300/30 hover:text-white hover:shadow-md hover:border-[#4d624d] transition-all duration-200 ease-in-out`}
                                >
                                    {navlink.label}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Menú de hamburguesa */}
                <div className='flex items-center space-x-4'>
                    <HiBars3BottomRight onClick={openNav} className="sm:w-8 sm:h-8 w-6 h-6 cursor-pointer text-white lg:hidden" />
                </div>
            </div>
        </div>
    );
};

export default Nav;

