"use client";
import SearchCode from '@/components/Helper/SearchCode';
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
        <div
            className={`fixed h-[10vh] z-[50] w-full right-2 transition-all duration-500 ease-in-out ${navBg ? "bg-custom-green" : "bg-transparent"
                }`}

        >
            <div className="flex left-3 items-center h-[80%] mt-2 justify-between w-[95%] sm:w-[90%] md:w-[85%] xl:w-[80%] mx-auto relative">
                <div
                    className={`bg-[#84ac84] opacity-65 p-2 transition-opacity duration-500 ${navBg ? "opacity-90" : "opacity-70"
                        } rounded-md shadow-md w-[90%] max-w-[150px] sm:w-[250px] sm:ml-5 md:ml-[-20px]`}
                >
                    <img
                        src="/images/logo-background.png"
                        alt="Logo"
                        className="w-full h-[52px] object-cover rounded-md"
                    />
                </div>


                <div className="lg:flex items-center justify-center space-x-6 text-white hidden flex-grow transition-transform md:space-x-8 absolute inset-x-0 right-0">
                    {navLinks.map((navlink) => (
                        <Link key={navlink.id} href={navlink.url}>
                            <p
                                className={`select-none font-medium text-white border-2 px-6 py-3 rounded-lg 
                      ${navBg ? "bg-transparent border-transparent" : "bg-transparent border-transparent"} 
                      hover:bg-gray-300/30 hover:text-white hover:shadow-md hover:border-[#4d624d] 
                      transition-all duration-200 ease-in-out whitespace-nowrap`}
                            >
                                {navlink.label}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-between w-full px-4 lg:px-8">
                    <div className="flex-1"></div>
                    <div className="z-10 ml-auto">
                        <SearchCode />
                    </div>
                    <HiBars3BottomRight
                        onClick={openNav}
                        className="cursor-pointer text-white w-7 h-7 sm:w-8 sm:h-8 md:w-7 md:h-7 lg:hidden"
                    />
                </div>

            </div>
        </div>
    );
};

export default Nav;
