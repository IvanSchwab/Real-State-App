"use client";
import React, { useEffect } from 'react'
import Hero from './Hero/Hero'
import AppartmentType from './AppartmentType/AppartmentType'
import Properties from './Properties/Properties'
import AboutUs from './AboutUs/AboutUs'
import Footer from './Footer/Footer'
import ScrollToTopButton from '../Helper/ScrollToTopButton'
import AOS from 'aos';
import 'aos/dist/aos.css';
import ResponsiveNav from './Navbar/ResponsiveNav';
import Appraisals from './Appraisals/Appraisals';
import FilterBox from '../Helper/FilterBox';


const Home = () => {
  useEffect(() => {
    const initAOS = async () => {
      await import('aos')
      AOS.init({
        duration: 1000,
        easing: "ease",
        once: true,
        anchorPlacement: "top-bottom",
      })
    };
    initAOS();
  }, []);

  return (
    <div className='overflow-hidden'>
      <ResponsiveNav />

      <section id="inicio">
        <Hero />
      </section>

      <AppartmentType />

      <section id='propiedades'>
        <Properties />
      </section>
      
      <section id='sobre-nosotros'>
        <AboutUs />
      </section>

      <section id='tasaciones'>
        <Appraisals />
      </section>

      <section id='contacto'>
        <Footer />
      </section>

      <ScrollToTopButton></ScrollToTopButton>
    </div>
  )
}

export default Home