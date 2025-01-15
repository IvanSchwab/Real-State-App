import SectionHeading from '@/components/Helper/SectionHeading'
import { appartmentTypeData } from '@/data/data'
import React from 'react'
import AppartmentTypeCard from './AppartmentTypeCard'

const AppartmentType = () => {
    return (
        <div className='pt-12 pb-12 bg-[#f8fcf3]'>
            <div className='w-[85%] mx-auto text-gray-700'>
                <SectionHeading heading='Tipos de Propiedades'></SectionHeading>
                <p className="mt-4 text-lg font-medium text-gray-600">
                    Descubre una variedad de opciones que se ajustan a tus necesidades y estilo de vida.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-8 gap-6 items-start'>
                    {appartmentTypeData.map((type, i) => (
                        <div
                            key={type.id}
                            data-aos="zoom-in"
                            data-aos-delay={`${i * 50}`} 
                            data-aos-duration="700"
                            data-aos-easing="ease-out-cubic"
                            data-aos-offset="150" 
                        >
                            <AppartmentTypeCard type={type}></AppartmentTypeCard>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AppartmentType
