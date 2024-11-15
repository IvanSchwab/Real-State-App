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
        <div className={`fixed ${navBg ? 'bg-gray-800' : ""} bg-[#4CAF50] h-[10vh] z-[100] w-full transition-all duration-200 bg-transparent`}>

            <div className="flex items-center h-full justify-between w-[95%] sm:w[90%] xl:w-[80%] mx-auto">
                { /* Logo */}
                <div className="flex items-center space-x-2">
                    <div className="md:w-10 md:h-10 w-7 h-7 rounded-full bg-[#95ED7C] text-white flex items-center shadow-md justify-center flex-col">
                        <FaHouse />
                    </div>
                    <h1 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide relative">
                        Olivera de Schwab
                        <span className="absolute left-[0.8%] sm:left-[0.8%] top-[80%] sm:top-[70%] text-xs sm:text-sm md:text-base font-normal text-gray-300">
                            Propiedades
                        </span>
                    </h1>


                </div>
                <div className="lg:flex items-center space-x-14 text-white hidden">
                    {navLinks.map((navlink) => {
                        return <Link key={navlink.id} href={navlink.url} >
                            <p className='font-medium hover:text-[#FEC905]'>{navlink.label}</p>
                        </Link>
                    })}
                </div>
                {/* login and burguer menu*/}

                <div className='flex items-center space-x-4'>
                    {/* login button */}

                    <div className='flex items-center cursor-pointer text-white space-x-2 hover:text-[#FEC905] transtition-all duration-200'>
                        <FaUserCircle className='w-5 h-5' />
                        <p className='font'> Iniciar sesión | Registrarse</p>
                    </div>
                    {/* burguer menu */}
                    <HiBars3BottomRight onClick={openNav} className="sm:w-8 sm:h-8 w-6 h-6 cursor:pointer text-white lg:hidden" />


                </div>

            </div>
        </div>
    )
}

export default Nav