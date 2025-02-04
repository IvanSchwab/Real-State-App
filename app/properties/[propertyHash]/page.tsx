import React from 'react';
import PropertyDescription from './propertyDescription';
import Map from './Map';
import Footer from '@/components/Home/Footer/Footer';
import ContactUs from './ContacUs';
import ScrollToTopButton from '@/components/Helper/ScrollToTopButton';
import ResponsiveNavProperty from './NavBarProperty/ResponsiveTitle';

const Page = ({ params }: { params: { propertyHash: string } }) => {
    return (
        <div className='bg-gray-50 min-h-screen flex flex-col'>
            <div className='z-0'>
                <ResponsiveNavProperty propertyHash={params.propertyHash}></ResponsiveNavProperty>
            </div>
            <div className="relative z-100 bg-white">
                <PropertyDescription />
            </div>

            <div className="relative z-0">
                <Map propertyHash={params.propertyHash} />
            </div>

            <div className="relative z-0 ">
                <ContactUs />
            </div>

            <div className="relative z-0">
                <Footer />
            </div>
            <div className="relative z-0">
            <ScrollToTopButton />
            </div>
        </div>
    );
};

export default Page;
