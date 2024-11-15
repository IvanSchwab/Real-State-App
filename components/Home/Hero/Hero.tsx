import SearchBox from '@/components/Helper/SearchBox'
import React from 'react'

const Hero = () => {
    return (
        <div className="w-full pt-[4vh] md:pt-[12vh] h-screen bg-[#0f0715] overflow-hidden relative 
        bg-[url('/images/hero.jpg')] bg-cover bg-center">
            { /* black overlay*/}
            <div className="absolute inset-0 bg-black opacity-50"> </div>
            { /* content */}
            <div className="flex justify-center items-center flex-col w-[95%] sm:w-[80%] h-full mx-auto relative z-10">
                <h1 className="text-white text-opacity-90 text-center text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-wide leading-tight shadow-md">
                    Encontrá
                </h1>
                <h1 className="text-white text-opacity-90 text-center font-extrabold text-4xl sm:text-6xl lg:text-7xl mt-6 mb-4">
                    Tu Hogar Ideal
                </h1>
                <div className="mt-12 w-full">
                    <SearchBox></SearchBox>
                </div>
            </div>
        </div>
    )
}

export default Hero