import React from 'react';
import PropertyDescription from './propertyDescription';
import Map from './Map';
import Footer from '@/components/Home/Footer/Footer';
import ContactUs from './ContacUs';

const Page = ({ params }: { params: { propertyHash: string } }) => {
    return (
        <div className='bg-gray-50'>
            <div className="relative z-10">
                <PropertyDescription />
            </div>

            <div className="relative z-0">
                <Map propertyHash={params.propertyHash} />
            </div>

            <div className="relative z-0">
                <ContactUs />
            </div>

            <div className="relative z-0">
                <Footer />
            </div>
        </div>
    );
};

export default Page;
