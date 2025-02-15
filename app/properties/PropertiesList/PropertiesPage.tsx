import React from 'react';
import PropertyList from './PropertyList';
import Footer from '@/components/Home/Footer/Footer';
import ScrollToTopButton from '@/components/Helper/ScrollToTopButton';
import WhatsappButton from '@/components/Helper/WhatsappButton';

export default function PropertiesPage() {
  return (
    <div className="bg-[#f8fcf3] font-quicksand ">
      <PropertyList />
      <div className="w-screen lg:transform sm:translate-x-[-4px] translate-y-[38px] lg:translate-x-[-8px]">
        <Footer />
      </div>
        <ScrollToTopButton/>
        <WhatsappButton />
    </div>
  );
};
