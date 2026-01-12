import Image from 'next/image';
import React from 'react'
import { FaBath, FaBed, FaSquare } from 'react-icons/fa';

type Props = {
    property: {
        propertyHash: string;
        title: string;
        bedrooms: number;
        bathrooms: number;
        landArea: number;
        price: number;
        mainImage: string;
        propertyOperation?: string;
    }
}

const PropertyCard = ({ property }: Props) => {
    return (
        <div className="bg-[#f8fcf3] overflow-hidden group rounded-lg cursor-pointer shadow-lg hover:shadow-2xl h-[500px] relative transition-all duration-300 hover:-translate-y-1">
            <div className="select-none relative">
                <div className="w-full h-64 overflow-hidden">
                    <div className="relative w-full h-full overflow-hidden">
                        <Image
                            src={property.mainImage}
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-all duration-500"
                            quality={85}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="group-hover:underline text-gray-900 font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300" style={{ maxWidth: '300px' }}>
                            {property.title}
                        </h1>
                        <p className="text-base font-bold text-black bg-gray-200 py-2 px-4 rounded-lg group-hover:bg-[#E3C565] transition-all duration-300">
                            ${property.price}
                        </p>
                    </div>

                    <div className="mt-6 w-full space-y-6">
                        <div className="flex justify-between">
                            <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                                <FaBed className="text-custom-green text-xl group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-sm font-medium select-none text-gray-700">
                                    {property.bedrooms} Dormitorios
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                                <FaBath className="text-custom-green text-xl group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-sm font-medium select-none text-gray-700">
                                    {property.bathrooms} Baños
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                                <FaSquare className="text-custom-green text-xl group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-sm font-medium select-none text-gray-700">
                                    {property.landArea} m²
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-0 w-full h-[40px]">
                <div className="w-full h-[1px] bg-gray-300"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 rounded-full bg-[#bcd1b7] px-6 py-2 group-hover:scale-110 transition-all duration-300">
                    <h1 className="inline-block bg-opacity-45 text-red-500 text-lg font-semibold px-4 py-2 rounded-full">
                        {property.propertyOperation}
                    </h1>
                </div>
            </div>
        </div>
    );


}

export default PropertyCard