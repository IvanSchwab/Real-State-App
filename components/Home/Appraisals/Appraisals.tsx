"use client";
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    }
  }
}

const Appraisals = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');


  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('reCAPTCHA script cargado');
    };
  }, []);

  const handleCaptcha = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        throw new Error('reCAPTCHA site key is not defined');
      }
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' });
      setCaptchaToken(token);
    } catch (error) {
      console.error('Error al obtener el token de reCAPTCHA', error);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setStatusMessage('Por favor, verifica el captcha.');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage("Correo enviado exitosamente.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatusMessage("Hubo un problema al enviar el correo.");
      }
    } catch (error) {
      console.error('Error al enviar correo:', error);
      setStatusMessage('Hubo un error al enviar el correo.');
    } finally {
      setIsSubmitting(false);
    };

  };

  return (
    <section className="bg-gradient-to-r bg-[#D9E4C3] to-green-100 py-16">
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0"
        data-aos="fade-up"
      >
        <div className="lg:w-2/4 space-y-6 text-center lg:text-left lg:ml-12">
          <h2 className="select-none text-4xl font-semibold text-custom-green font-poppins">
            Tasaciones Inmobiliarias
          </h2>
          <p className="select-none text-xl text-gray-700 leading-relaxed font-poppins">
            Realizamos evaluaciones precisas de propiedades para ayudarte a tomar decisiones informadas.
            Con años de experiencia en el sector inmobiliario, ofrecemos informes detallados que se ajustan
            a tus necesidades, ya sea para vender, comprar o invertir.
          </p>
          <p className="select-none text-xl text-gray-700 leading-relaxed font-poppins">
            Contáctanos para una tasación personalizada de tu propiedad.
          </p>
        </div>

        <div className="lg:w-2/4 mt-8 bg-[#B5CDB1] p-6 rounded-lg shadow-md w-full max-w-md min-w-[350px]">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-poppins select-none">Solicita tu Tasación</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
                aria-label="Nombre"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 px-3 py-2 border rounded-md text-gray-700"
                style={{ minWidth: '100%', maxWidth: '120%' }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
                aria-label="Correo Electrónico"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex mt-1 px-3 py-2 border rounded-md text-gray-700"
                style={{ minWidth: '100%', maxWidth: '120%' }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
                aria-label="Mensaje"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 px-3 py-2 border rounded-md resize-none text-gray-700"
                style={{ minWidth: '100%', maxWidth: '120%' }}
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#89c77c] text-white py-2 px-4 rounded-md hover:bg-[#7cb370] transition duration-200"
              onClick={handleCaptcha} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>

          {statusMessage && (
            <p className="mt-4 text-sm font-semibold text-gray-600">{statusMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Appraisals;
