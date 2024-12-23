import Image from 'next/image';
import Link from 'next/link';  
import React from 'react';

type Props = {
    type: {
        id: number;
        icon: string;
        type: string;
        number: number;
    }
}

const AppartmentTypeCard = ({ type }: Props) => {
    return (
        <Link href={`/properties?type=${type.id}`}>  {/* Link dinámico */}
            <div className='rounded-lg shadow-lg p-6 hover:scale-110 transition-all duration-300'>
                <Image src={type.icon} alt={type.type} width={50} height={50} />
                <div className='mt-12'>
                    <h1 className='text-lg font-bold text-gray-800'>{type.type}</h1>
                </div>
            </div>
        </Link>
    )
}

export default AppartmentTypeCard;
