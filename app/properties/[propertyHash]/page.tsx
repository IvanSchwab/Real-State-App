import React from 'react';
import PropertyDescription from './details/propertyDescription';
import Map from './details/Map';
import Footer from '@/components/Home/Footer/Footer';
import ContactUs from './details/ContacUs';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import ResponsiveNavProperty from './NavProperty/ResponsiveTitle';

interface PageProps {
    params: Promise<{ propertyHash: string }>;
}

export default async function Page({ params }: PageProps) {
    const { propertyHash } = await params;

    return (
        <div className='bg-gray-50 min-h-screen font-quicksand flex flex-col'>
            <div className='z-0'>
                <ResponsiveNavProperty propertyHash={propertyHash} />
            </div>
            <div className="relative z-100 bg-white">
                <PropertyDescription />
            </div>
            <div className="relative z-0">
                <Map propertyHash={propertyHash} />
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
}
