"use client";
import SearchCode from '@/components/common/SearchCode';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Props = {
    openNav: () => void;
    propertyTitle: string;
};

const PropertyTitle = ({ propertyTitle }: Props) => {
    const [, setNavBg] = useState(false);

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
        <div className={`w-full bg-custom-green transition-all duration-500 ease-in-out`}>
            <div className="flex items-center h-[10vh] justify-between w-[95%] sm:w-[90%] md:w-[85%] xl:w-[80%] mx-auto">
                <Link href="/">
                    <div
                        className="hidden sm:block bg-[#84ac84] opacity-90 p-2 rounded-md max-w-xs cursor-pointer shadow-md hover:opacity-100 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        <div className="relative mb-3 w-full h-[52px] rounded-md">
                            <Image
                                src="/images/logo-background.png"
                                alt="Logo"
                                width={150}
                                height={52}
                                sizes="(max-width: 768px) 100px, 150px"
                                className="object-cover rounded-md"
                                quality={100}
                            />
                        </div>
                    </div>
                </Link>

                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <p
                        title={propertyTitle}
                        className="relative inline-block px-6 py-3 border-2 border-[#406642] bg-[#385839] rounded-lg select-none uppercase font-bold text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-[#528a55] overflow-hidden"
                    >
                        <span className="relative z-10 text-white">
                            {propertyTitle.length > 35 ? `${propertyTitle.slice(0, 35)}...` : propertyTitle}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-br bg-custom-green opacity-80 blur-md"></span>
                    </p>
                </div>
                <SearchCode />
            </div>
        </div>
    );

};

export default PropertyTitle;
