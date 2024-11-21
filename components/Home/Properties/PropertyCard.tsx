import Image from 'next/image';
import React from 'react'
import { FaBath, FaBed, FaSquare } from 'react-icons/fa';

type Props = {
    property: {
        id: number;
        propertyName: string;
        location: string;
        bedrooms: number;
        bathrooms: number;
        size: number;
        price: number;
        imageUrl: string;
        contrat?: string;
    }
}

const PropertyCard = ({ property }: Props) => {
    return (
        <div className='bg-white overflow-hidden group rounded-lg cursor-pointer shadow-lg'>
            <div className='select-none relative'>
                <Image
                    src={property.imageUrl}
                    alt={property.propertyName}
                    width={300}
                    height={300}
                    className='w-full object-cover group-hover:scale-110 transition-all duration-300'
                />
                <div className='p-5'>
                    {/* Nombre de la propiedad y precio alineados */}
                    <div className='flex items-center justify-between'>
                        <h1 className='group-hover:underline text-gray-900 font-bold text-lg'>
                            {property.propertyName}
                        </h1>
                        <p className='text-base font-bold text-black bg-gray-200 py-1 px-2 rounded-lg'>
                            ${property.price}
                        </p>
                    </div>

                    <p className='text-sm text-gray-500 mt-3'>{property.location}</p>

                    {/* Iconos y detalles */}
                    <div className='mt-6 w-full lg:w-[80%] space-y-6'>
                        <div className='flex items-center justify-between space-x-6'>
                            <div className='flex items-center space-x-2'>
                                <FaBed className='text-custom-green text-xl' />
                                <p className='text-sm font-medium select-none text-gray-700'>
                                    {property.bedrooms} Dormitorios
                                </p>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <FaBath className='text-custom-green text-xl' />
                                <p className='text-sm font-medium select-none text-gray-700'>
                                    {property.bathrooms} Baños
                                </p>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <FaSquare className='text-custom-green text-xl' />
                                <p className='text-sm font-medium select-none text-gray-700'>
                                    {property.size} m²
                                </p>
                            </div>
                        </div>

                        {/* Contrato */}
                        <div className='relative'>
                            <div className='w-full h-[1px] bg-gray-300'></div>
                            <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4'>
                                <h1 className='text-rose-600 text-lg font-semibold'>
                                    {property.contrat}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default PropertyCard