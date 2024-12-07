import React from 'react';
import PropertyList from './PropertyList';
import Footer from '@/components/Home/Footer/Footer';

export default function PropertiesPage() {
  return (
    <div className="bg-[#f8fcf3] py-8 px-4">
      <PropertyList />
      <div className="py-1 w-screen transform  translate-y-[32px] translate-x-[-16px]">
        <Footer />
      </div>
    </div>
  );
};
