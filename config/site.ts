/**
 * Datos fijos del negocio. Es el ÚNICO lugar donde viven: ningún componente
 * debe hardcodear teléfono, dirección, cifras ni redes.
 * Lo que dependa de la API (precios, fotos, títulos) NO va acá.
 */
export const SITE = {
  name: "Olivera de Schwab Propiedades",
  tagline: "Inmobiliaria familiar en San Martín. Ventas, alquileres y tasaciones.",
  city: "San Martín",

  phoneDisplay: "+54 9 11 6456-6539",
  phoneTel: "+5491164566539",
  whatsappNumber: "5491164566539",

  address: "C. Lincoln 3598, San Martín",

  instagram: "https://www.instagram.com/oliveradeschwab/?hl=es-la",
  facebook: "https://www.facebook.com/p/Olivera-De-Schwab-Propiedades-100064059664407/?locale=es_LA",

  /** Cifras de la franja de confianza (Home). */
  stats: {
    years: 15,
    operations: 500,
    activeRentals: 30,
  },

  /**
   * TODO(pendiente): número de matrícula del Colegio de Martilleros.
   * Mientras sea null no se muestra en ningún lado (ni placeholder).
   */
  license: null as string | null,

  /**
   * TODO(pendiente): qué campo de la API es el "código público" de la propiedad
   * (el que se usa en "Buscar por código"). Mientras sea null, el código
   * interno (`code`, ej. "1584-casa suarez combet") NO se muestra.
   * Cuando se defina, cambiar a "codeSearch" / "codeRaw" / etc.
   */
  publicCodeField: null as string | null,

  legal:
    "Las medidas indicadas son aproximadas y se confirmarán en el título de propiedad de cada inmueble. Las fotos, imágenes y videos son ilustrativos y no tienen carácter contractual. Los precios son orientativos y pueden estar sujetos a cambios.",
  legalShort:
    "Las medidas indicadas son aproximadas y se confirmarán en el título de propiedad. Las fotos son ilustrativas y no tienen carácter contractual. Los precios son orientativos y pueden estar sujetos a cambios.",

  developer: { name: "Iván Schwab", url: "https://ivanschwabdev.vercel.app/" },

  /** Navegación principal. Los hrefs son absolutos para funcionar desde cualquier página. */
  nav: [
    { label: "Propiedades", href: "/properties" },
    { label: "Tasaciones", href: "/#tasacion" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ],
} as const;
