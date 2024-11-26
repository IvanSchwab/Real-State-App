import React from 'react'
import Hero from './Hero/Hero'
import AppartmentType from './AppartmentType/AppartmentType'
import Properties from './Properties/Properties'
import AboutUs from './AboutUs/AboutUs'
import Footer from './Footer/Footer'
import ScrollToTopButton from '../Helper/ScrollToTopButton'

const Home = () => {
  return (
    <div className='overflow-hidden'>
      <section id="inicio">
        <Hero />
      </section>

      <AppartmentType />

      <Properties />
      <section id='sobre-nosotros'>
        <AboutUs />
      </section>

      <section id='contacto'>
        <Footer />
      </section>
      <ScrollToTopButton></ScrollToTopButton>
    </div>
  )
}

export default Home