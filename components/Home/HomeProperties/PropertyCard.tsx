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
        propertyOperation?: string;
    }
}

const PropertyCard = ({ property }: Props) => {
    return (
        <div className="bg-[#f8fcf3] overflow-hidden group rounded-lg cursor-pointer shadow-lg h-[500px] relative"> 
            <div className="select-none relative">
                <div className="w-full h-64 overflow-hidden">
                    <img
                        src={property.mainImage}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                    />
                </div>

                <div className="p-6"> 
                    <div className="flex items-center justify-between mb-4"> 
                        <h1 className="group-hover:underline text-gray-900 font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: '300px' }}>
                            {property.title}
                        </h1>
                        <p className="text-base font-bold text-black bg-gray-200 py-2 px-4 rounded-lg"> 
                            ${property.price}
                        </p>
                    </div>

                    <div className="mt-6 w-full space-y-6">
                        <div className="flex justify-between">
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
            </div>

            <div className="absolute bottom-6 left-0 w-full h-[40px]">
                <div className="w-full h-[1px] bg-gray-300"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 rounded-full bg-[#bcd1b7] px-6 py-2">
                    <h1 className="inline-block bg-opacity-45 text-red-500 text-lg font-semibold px-4 py-2 rounded-full transition duration-300 ease-in-out">
                        {property.propertyOperation}
                    </h1>
                </div>
            </div>
        </div>
    );


}

export default PropertyCard