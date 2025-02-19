import React from 'react';
import Footer from '@/components/Home/Footer/Footer';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import WhatsappButton from '@/components/common/WhatsappButton';
import PropertyList from './PropertyList';

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
