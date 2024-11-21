import React from 'react'

type Props = {
    heading: string;
}

const SectionHeading = ({ heading }: Props) => {
    return (
        <div>
            <h1 className='select-none text-2x1 sm:text-3xl font-bold mb-2 text-gray-800'>
                {heading}
            </h1>
            <p className='select-none text-sm text-gray-700'> Lorem ipsum Lorem ipsum Lorem ipsum </p>
        </div>
    )
}

export default SectionHeading