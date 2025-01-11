import Image from 'next/image';
import React from 'react'
import { FaBath, FaBed, FaSquare } from 'react-icons/fa';

type Props = {
    property: {
        propertyHash: string;
        title: string;
        bedrooms: number;
        bathrooms: number;
        size: number;
        price: number;
        mainImage: string;
        contrat?: string;
    }
}

const PropertyCard = ({ property }: Props) => {
    return (
        <div className="bg-[#f8fcf3] overflow-hidden group rounded-lg cursor-pointer shadow-lg h-full min-h-[450px]">
            <div className="select-none relative">
                {/* Contenedor de la imagen con altura fija */}
                <div className="w-full h-64 overflow-hidden">
                    <img
                        src={property.mainImage}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                    />
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <h1 className="group-hover:underline text-gray-900 font-bold text-lg">
                            {property.title}
                        </h1>
                        <p className="text-base font-bold text-black bg-gray-200 py-1 px-2 rounded-lg">
                            ${property.price}
                        </p>
                    </div>

                    <div className="mt-6 w-full lg:w-[80%] space-y-6">
                        <div className="flex items-center justify-between space-x-6">
                            <div className="flex items-center space-x-2">
                                <FaBed className="text-custom-green text-xl" />
                                <p className="text-sm font-medium select-none text-gray-700">
                                    {property.bedrooms} Dormitorios
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaBath className="text-custom-green text-xl" />
                                <p className="text-sm font-medium select-none text-gray-700">
                                    {property.bathrooms} Baños
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaSquare className="text-custom-green text-xl" />
                                <p className="text-sm font-medium select-none text-gray-700">
                                    {property.size} m²
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative h-[25px]">
                    <div className="w-full h-[1px] bg-gray-300"></div>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#f8fcf3] px-4">
                        <h1 className="text-rose-600 text-lg font-semibold">
                            {property.contrat}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyCard