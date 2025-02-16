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
import WhatsappButton from '../Helper/WhatsappButton';

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
    <div className='overflow-hidden font-quicksand'>
      <ResponsiveNav />

      <section id="Inicio">
        <Hero />
      </section>

      <AppartmentType />

      <section id='Propiedades'>
        <Properties />
      </section>
      
      <section id='Sobre-Nosotros'>
        <AboutUs />
      </section>

      <section id='Tasaciones'>
        <Appraisals />
      </section>

      <section id='Contacto'>
        <Footer />
      </section>

      <ScrollToTopButton/>
      <WhatsappButton />
    </div>
  )
}

export default Home