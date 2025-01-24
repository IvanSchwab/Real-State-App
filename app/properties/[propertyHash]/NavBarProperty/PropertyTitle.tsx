"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Props = {
    openNav: () => void;
    propertyTitle: string;
};

const PropertyTitle = ({ openNav, propertyTitle }: Props) => {
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
        <div className={`w-full bg-custom-green transition-all duration-500 ease-in-out`}>
            <div className="flex items-center h-[10vh] justify-between w-[95%] sm:w-[90%] md:w-[85%] xl:w-[80%] mx-auto">
                <Link href="/">
                    <div
                        className="hidden sm:block bg-[#84ac84] opacity-90 p-2 rounded-md max-w-xs cursor-pointer shadow-md hover:opacity-100 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        <img
                            src="/images/logo-background.png"
                            alt="Logo"
                            className="object-cover w-full h-[52px] rounded-md"
                        />
                    </div>
                </Link>

                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <p
                        className="select-none border-2 px-6 py-3 rounded-lg 
                            bg-gray-300/30 text-white shadow-md border-[#4d624d] 
                                transition-all duration-200 ease-in-out whitespace-nowrap
                                    text-shadow-lg"
                    >
                        {propertyTitle.length > 20 ? `${propertyTitle.slice(0, 35)}...` : propertyTitle}
                    </p>
                </div>
            </div>
        </div>
    );

};

export default PropertyTitle;
