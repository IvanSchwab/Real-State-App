import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-r bg-white to-green-100 py-16">
      {/* Contenedor principal con flexbox y un gradiente sutil */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0">

        {/* Imagen */}
        <div className="relative w-full lg:w-1/2 h-96 overflow-hidden rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500 ease-in-out select-none">
          <img
            data-aos="zoom-in-mini"
            data-aos-duration="800"
            data-aos-easing="ease-out"
            data-aos-offset="200"
            src="/images/picture-real-state.jpg"
            alt="Imagen de la empresa"
            className="object-cover w-full h-full rounded-3xl"
          />
        </div>

        {/* Sección de texto */}
        <div className="lg:w-2/4 space-y-6 text-center lg:text-left lg:ml-12">
          <h2 className="select-none text-4xl font-semibold text-custom-green font-poppins">
            Sobre Nosotros
          </h2>
          <p className="select-none text-xl text-gray-700 leading-relaxed font-poppins">
            Somos una empresa familiar con más de 10 años de experiencia en el rubro inmobiliario,
            especializados en ofrecer soluciones personalizadas para cada uno de nuestros clientes.
            Ayudamos a encontrar el hogar de sus sueños o la inversión perfecta.
          </p>
          <p className="select-none text-xl text-gray-700 leading-relaxed font-poppins">
            Nuestra sólida red de contactos y colaboradores nos permite ofrecer una amplia gama de
            propiedades y asesoramiento especializado. Creemos que cada cliente merece un trato único
            y personalizado, y trabajamos incansablemente para superar sus expectativas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
