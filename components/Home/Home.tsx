import React from 'react'
import Hero from './Hero/Hero'
import AppartmentType from './AppartmentType/AppartmentType'
import Properties from './Properties/Properties'

const Home = () => {
  return (
    <div className='overflow-hidden'>

      <Hero />
      <AppartmentType></AppartmentType>
      <Properties></Properties>
    </div>
  )
}

export default Home