"use client";
import SearchCode from '@/components/common/SearchCode';
import { navLinks } from '@/constant/constant';
import Image from 'next/image';
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
        <div className={`fixed h-[10vh] font-quicksand z-[50] w-full transition-all duration-500 ${navBg ? "bg-custom-green" : "bg-transparent"}`}>
            <div className="flex items-center h-[80%] mt-2 justify-between w-[95%] sm:w-[90%] md:w-[85%] xl:w-[80%] mx-auto">
                <div
                    className={`bg-[#84ac84] opacity-65 p-2 transition-opacity duration-500 ${navBg ? "opacity-90" : "opacity-70"
                        } rounded-md shadow-md w-[90%] max-w-[150px] sm:w-[250px] sm:ml-5 md:ml-[-20px] `}
                >
                    <div className="relative w-full h-[52px] rounded-md overflow-hidden">
                        <Image
                            src="/images/logo-background.webp"
                            alt="Logo"
                            fill
                            sizes="(max-width: 768px) 100px, 150px"
                            className="object-cover rounded-md"
                            quality={100}
                        />
                    </div>
                </div>

                <div className="hidden lg:flex items-center flex-grow justify-center space-x-4 xl:space-x-6 mx-4">
                    {navLinks.map((navlink) => (
                        <Link key={navlink.id} href={navlink.url}>
                            <p className={`font-medium text-white px-4 py-3 rounded-lg transition-all
                                ${navBg ? "bg-transparent" : "bg-transparent border-transparent"}
                                hover:bg-gray-300/30 hover:shadow-md hover:border-[#4d624d]
                                text-sm xl:text-base  hover:text-white   
                      transition-all duration-200 ease-in-out whitespace-nowrap`}>
                                {navlink.label}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-auto">
                    <div className="relative w-[55px] sm:w-[60px] md:w-[40px] lg:w-[100px]">
                        <SearchCode />
                    </div>
                    <HiBars3BottomRight
                        onClick={openNav}
                        className="cursor-pointer text-white w-7 h-7 lg:hidden"
                    />
                </div>
            </div>
        </div>
    );
};

export default Nav;