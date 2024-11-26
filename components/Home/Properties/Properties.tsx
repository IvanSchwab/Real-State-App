import SectionHeading from '@/components/Helper/SectionHeading'
import { properties } from '@/data/data'
import React from 'react'
import PropertyCard from './PropertyCard'

const Properties = () => {
    return (
        <div className='pt-16 pb-16 bg-[#D9E4C3]'>
            <div className='w-[80%] mx-auto'>
                <SectionHeading heading="Propiedades Destacadas" />
                <p className="mt-4 text-xl text-gray-600 text-left font-medium">
                    Explora nuestras propiedades más recomendadas y encuentra la opción ideal para ti.
                </p>
                <div className='mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center'>
                    {properties.map((property) => {
                        return <div key={property.id}>
                            { /* Property Card */}
                            <PropertyCard property={property}></PropertyCard>
                        </div>

                    })}
                </div>
            </div>
        </div>
    )
}

export default Properties