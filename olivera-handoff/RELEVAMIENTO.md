# RELEVAMIENTO

## 1. Stack y estructura
- **Framework:** Next.js 15.2.8 con **App Router** para las páginas y **Pages Router solo para `/api`**. React 18, TypeScript estricto y alias `@/*`.
- **Estilos:** Tailwind 3.4 (`tailwind.config.ts`: color `custom-green` #647C64 y fuente `quicksand`) más `app/globals.css` (Quicksand y Josefin por `@import`, scrollbar custom, range inputs, `.truncate` global con `max-width:63%`, modo oscuro por `prefers-color-scheme`). `app/layout.tsx` carga Roboto con `next/font`, pero el body la pisa con Quicksand.
- **Animación:** AOS (`data-aos`), que se inicializa en `components/Home/Home.tsx` y otra vez en `Appraisals.tsx`.
- **Imágenes:** `next/image` con `unoptimized: true` y dominio `images.mapaprop.app` (`next.config.ts`).
- **Íconos:** react-icons y lucide-react (este último solo en el mapa).
- **Dependencias sin uso real:** leaflet/react-leaflet, react-map-gl, react-magnifying-glass, react-awesome-reveal, el SDK `resend` (se llama a la API con axios) y `react-google-recaptcha` (el script se inyecta a mano). No las toco.
- **Lint:** `next lint` (`next/core-web-vitals` + `next/typescript`). No hay tests.

**Rutas**
| Ruta | Archivo | Componentes |
|---|---|---|
| `/` | `app/page.tsx` → `components/Home/Home.tsx` | ResponsiveNav (Nav + MobileNav), Hero + SearchBox, AppartmentType, Properties (+PropertyCard), AboutUs, Appraisals, Footer, ScrollToTopButton, WhatsappButton |
| `/properties` | `app/properties/page.tsx` (Suspense) → `list/PropertiesPage.tsx` | PropertyList (con la card inline), FilterBox, Footer, ScrollToTopButton, WhatsappButton |
| `/properties/[propertyHash]` | `app/properties/[propertyHash]/page.tsx` | NavProperty/ResponsiveTitle + PropertyTitle, details/propertyDescription (+ImageGallery), details/Map, details/ContacUs, Footer, ScrollToTopButton |
| `/api/sendEmail` | `pages/api/sendEmail.ts` | handler de formularios |
| `/api/sitemap.xml` | `pages/api/sitemap.xml.ts` | sitemap dinámico |
| `/api/verificarCaptcha` | `pages/api/verificarCaptcha.ts` | helper exportado como default (Next lo expone como ruta, aunque nadie lo usa) |

Otros archivos: `components/common/ScrollToTop.tsx` (en el layout, hace scroll al tope al montar), `constant/constant.ts` (navLinks y los tipos `Property`/`PropertyData`), `data/data.ts` (tipos de propiedad del Home con IDs fijos: 2 Casa, 1 Departamento, 7 Oficina, 4 Terreno, 10 PH).

## 2. Fuentes de datos

### Mapaprop (todo del lado del cliente con `fetch`)
Variables: `NEXT_PUBLIC_API_URL` (termina en `/`) y `NEXT_PUBLIC_API_KEY`, enviada como `?oauth_token=` **y** como `Authorization: Bearer`. La key queda expuesta en el navegador: es así hoy y no se toca.

| Endpoint | Dónde | Params enviados | Respuesta usada |
|---|---|---|---|
| `GET properties` | `PropertyList.tsx` | `size=9`, `from=(page-1)*9`, `limit=9`, `operation` (1 Venta / 2 Alquiler), `type`, `bedrooms`, `priceTo`, `zone1` (provincia), `zone2` (partido) | `{ properties: Property[], total }` |
| `GET properties` | `HomeProperties/Properties.tsx` | primero `size=1` (total, que después no se usa) y luego `size=6&view=list` | `properties` |
| `GET properties?codeSearch=` | `common/SearchCode.tsx` | `codeSearch` (URL con doble `/`: `${apiUrl}/properties`) | busca coincidencia **exacta** en `properties[].code` y navega a `/properties/{propertyHash}` |
| `GET properties` | `pages/api/sitemap.xml.ts` (server) | sin params | `propertyHash`, `lastUpdate` |
| `GET properties/{hash}` | se llama **3 veces** en la ficha: `ResponsiveTitle.tsx` (title), `propertyDescription.tsx` (todo) y `Map.tsx` (location) | — | `PropertyData` |
| `GET types` | `SearchBox.tsx` y `FilterBox.tsx` (hook `useFetchData` duplicado) | — | `{ types: [{id, description}] }` |
| `GET zones` | ídem | — | `{ states: [{id, description, counties: [{id, description}]}] }` |

**Campos (según `constant/constant.ts` y el uso real)**
- **Listado (`Property`):** `title`, `propertyHash`, `price` (number), `currency` (string, formato a confirmar con datos reales), `propertyOperation` ("Venta"/"Alquiler"), `propertyType`, `mainImage` (**URL completa**, se usa directo), `address`, `city`, `county`, `state`, `bedrooms`, `bathrooms`, `landArea`, `location{lat,lon}`, `rented`, `sold`, `lastUpdate`, `images[]`, `description(Formatted)`.
- **Ficha (`PropertyData`):** `title`, `price`, `currency`, `code`, `codeRaw`, `codeSearch`, `propertyId`, `ambiences`, `landArea`, `propertyType`, `type` (id), `operation` (id), `propertyOperation`, `zone0/1/2` y `zone0Desc/zone1Desc/zone2Desc`, `address`, `zipCode`, `descriptionFormatted`, `mainImage` (**nombre de archivo**, se le antepone `https://images.mapaprop.app/photos/`), `images[].image` (ídem), `location{lat,lon}`, `rented`, `sold`, `reserved`, `labels[]`, `customerName`, `customerPhone`. `bedrooms` y `bathrooms` no están tipados en `PropertyData`; hay que confirmar que la API los devuelve en la ficha.
- **Paginación:** del lado del cliente, con `total / 9`; la página va en `?page=N`.

### Resend (formularios)
- Front: `components/Home/Appraisals/Appraisals.tsx` (tasación) y `app/properties/[propertyHash]/details/ContacUs.tsx` (ficha). Los dos tienen código idéntico: inyectan el script de reCAPTCHA v3 con `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, piden el token y hacen `POST /api/sendEmail` con `{ name, email, subject, message, captchaToken }` (`subject` siempre va vacío).
- Back: `pages/api/sendEmail.ts`. Rate limit en memoria (5 por hora por IP), obligatorios `name`, `email`, `message` y `captchaToken`, regex de email, verificación de reCAPTCHA (`RECAPTCHA_SECRET_KEY`, score ≥ 0.5), límites de largo (name/subject ≤ 100, message ≤ 1000), sanitiza `<` y `>`, y hace `POST https://api.resend.com/emails` con `from: onboarding@resend.dev` y el destinatario **fijo en el código**, con `RESEND_API_KEY`.

### Mapbox
- `app/properties/[propertyHash]/details/Map.tsx` usa `mapbox-gl` y `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Estilos: streets, satellite-streets, light y dark. Tiene marcador, popup, NavigationControl, FullscreenControl y vista 3D (pitch más la capa `3d-buildings`).
- **Calcular ruta:** Geocoding v5 (`mapbox.places/{dirección}`) seguido de Directions v5 `driving` (de la propiedad al usuario). Dibuja la capa `route` y muestra distancia (km) y duración (min).

### Otras variables
`NEXT_PUBLIC_SITE_URL` (links de compartir y sitemap; el sitemap lanza un error al cargar el módulo si falta alguna variable).

## 3. Funcionalidades actuales
| Funcionalidad | Archivo |
|---|---|
| Nav fija con fondo al scrollear, links con anclas (#Inicio, #Propiedades, #Sobre-Nosotros, #Tasaciones, #Contacto) | `components/Home/Navbar/Nav.tsx`, `constant/constant.ts` |
| Menú hamburguesa mobile (drawer) | `Navbar/MobileNav.tsx`, `ResponsiveNav.tsx` |
| Buscar por código (modal con portal, Enter, mensajes de error) en Home, listado y ficha | `components/common/SearchCode.tsx` |
| Buscador del hero: Tipo, Operación, Zona (provincia), Partido (dependiente), Habitaciones, Precio hasta → `/properties?...`; modal de filtros en mobile | `components/Home/Hero/SearchBox.tsx` |
| Tipos de propiedad → `/properties?type={id}` | `AppartmentType/*`, `data/data.ts` |
| Propiedades recientes (6) + skeleton + "Ver todas" | `HomeProperties/Properties.tsx`, `PropertyCard.tsx` |
| Click en card: navega; con clic medio o Ctrl/Cmd abre pestaña nueva (`onMouseDown`, no son `<a>`) | `Properties.tsx`, `PropertyList.tsx` |
| Sobre nosotros | `AboutUs/AboutUs.tsx` |
| Formulario de tasación + reCAPTCHA v3 | `Appraisals/Appraisals.tsx` |
| Footer: disclaimer legal, Instagram, Facebook, WhatsApp, teléfono, dirección, crédito del software, logos (propio y Colegio de Martilleros) | `Footer/Footer.tsx` |
| FAB de WhatsApp sin mensaje (Home y listado) | `common/WhatsappButton.tsx` |
| Botón volver arriba | `common/ScrollToTopButton.tsx` |
| Listado: filtros (Tipo, Provincia, Partido, Operación, Habitaciones 1–4+, Valor máx.) en barra fija, desplegable en mobile | `app/properties/list/FilterBox.tsx` |
| Listado: grilla de 9, loader a pantalla completa, estado vacío "Volver al inicio", paginación anterior/números/siguiente | `PropertyList.tsx` |
| Ficha: barra con título truncado, volver (history.back) y buscar por código | `NavProperty/*` |
| Ficha: foto principal con **lupa** al pasar el mouse (desktop) | `details/propertyDescription.tsx` |
| Ficha: galería de miniaturas (5/8/11 según el ancho) + "+N más" (modal con todas) | `details/ImageGallery.tsx` |
| Ficha: **visor** a pantalla completa con anterior/siguiente, swipe, pinch zoom, doble clic para zoom, pan con mouse y puntos (sin teclado) | `details/ImageGallery.tsx` |
| Ficha: etiquetas de alquilada/vendida, precio, zona, operación, código, ambientes, tipo, propietario (`customerName`), teléfono (`customerPhone`), dirección, código postal y descripción | `propertyDescription.tsx` |
| Ficha: compartir en WhatsApp, Facebook, X y LinkedIn (4 botones) | `propertyDescription.tsx` |
| Ficha: FAB de WhatsApp con mensaje precargado (título, precio, dirección y link) | `propertyDescription.tsx` (`handleContact`) |
| Ficha: mapa con estilos, 3D, fullscreen, calcular ruta y modo claro/oscuro | `details/Map.tsx` |
| Ficha: formulario de contacto | `details/ContacUs.tsx` |
| Sitemap dinámico | `pages/api/sitemap.xml.ts` |
| Scroll al tope al montar | `common/ScrollToTop.tsx` (layout) |

## 4. Mapeo diseño ↔ datos
| Dato del diseño | Campo real | Notas |
|---|---|---|
| Precio | `price` | Formateo `es-AR` con punto de miles. |
| Moneda (`USD` / `$`) | `currency` | Hay que ver los valores reales ("USD", "ARS", "$"?) y normalizarlos en un helper. |
| `/ mes` | `propertyOperation === "Alquiler"` (o `operation === 2`) | |
| Etiqueta Venta / Alquiler | `propertyOperation` | |
| Título | `title` | |
| Ubicación en card ("Combet, San Martín") | listado: `address`, `city`, `county`; ficha: `zone2Desc`, `zone1Desc`, `address` | Hay que definir la composición con datos reales. |
| Dormitorios | `bedrooms` | En la ficha no está tipado; confirmar. Solo si es > 0. |
| Baños | `bathrooms` | Ídem. |
| m² / Superficie | `landArea` | **La API no trae superficie cubierta ni total por separado** (o no se usa hoy). |
| Ambientes | `ambiences` (ficha) | En el listado no se tipa. |
| Tipo | `propertyType` | |
| Descripción | `descriptionFormatted` | |
| Fotos | listado: `mainImage` (URL); ficha: `mainImage` + `images[].image` (archivo) | |
| Código público | **No definido.** `code` es el interno (ej. `1584-casa suarez combet`); también existen `codeRaw`, `codeSearch` y `propertyId` | Pendiente. Ojo: el buscador hoy hace match exacto contra `code`. |
| Migas (Propiedades / Venta / San Martín) | `propertyOperation`, `zone2Desc` | |
| Similares | `GET properties` con `operation` + `zone2` o `type` | Hay que confirmar que `zone2` del detalle es el id que acepta el filtro. |
| Filtro Zona (localidades) | `zones` → `states[].counties[]` | El diseño muestra una sola lista de localidades; hoy son dos niveles (provincia → partido). Se mantienen los dos niveles con el estilo nuevo. |
| Precio mín. | `priceFrom` | El SearchBox lo arma, pero el listado **no lo envía a la API**. Soporte sin verificar → pendiente. |
| Superficie mínima, Orden | — | **La API no lo soporta hoy** (no hay params). Pendiente. |
| Características | — | No vienen estructuradas → se omite la sección. |
| Lista / Mapa | `location` existe en el listado | Vista mapa pendiente por alcance. |
| Stats (+15 años, +500 operaciones, ~30 alquileres), matrícula, teléfono, dirección, redes | — | No vienen de la API → archivo de config (matrícula como TODO). |
| Tipos del Home (6) | `GET types` | Hoy están fijos en `data.ts` y falta Locales. Uso los ids de `/types`, matcheando por descripción, con el fallback a los ids actuales. |
| Vendida / Alquilada / Reservada | `sold`, `rented`, `reserved` | El diseño no lo muestra; lo conservo como etiqueta. |

## 5. Riesgos
1. **Sticky roto:** `Home.tsx` usa `overflow-hidden` en la raíz, y el listado y la ficha ponen `document.body.style.overflow='hidden'` mientras cargan. Hay que pasar a `overflow-x: clip` y no dejar el body bloqueado.
2. **Paginación pierde filtros:** `handlePageChange` hace `router.push('?page=N')` y descarta los filtros (bug actual). El rediseño los conserva: cambia el comportamiento, para mejor.
3. **Formularios:** el diseño saca el email. Requiere el cambio compatible en `sendEmail` (email **o** teléfono). Si se rompe, se pierden consultas: probarlo con envío real.
4. **Código interno:** ocultar `code` mientras el buscador sigue usando `code` → el usuario no sabe qué tipear hasta que se defina el código público.
5. **Datos de "Propietario" y "Teléfono" (`customerName`/`customerPhone`) y código postal** en la ficha: el diseño no los muestra; los reemplaza la tarjeta de la oficina (config). Se dejan de mostrar.
6. **Tres fetch del mismo detalle:** al reestructurar la ficha unifico en un único hook con **la misma llamada** (mismo endpoint y headers), sin cambiar la integración.
7. **Cards como `<a>`:** hoy navegan con `onMouseDown`. Pasar a `<Link>` mantiene clic medio y Ctrl/Cmd de forma nativa, pero cambia la mecánica.
8. **Tipografías:** Fraunces e Inter vía `next/font/google` (viene con Next, sin dependencias nuevas). Hay que sacar el `@import` de Quicksand y la regla global `.truncate` (pisa la utilidad de Tailwind con `max-width:63%`).
9. **Tailwind + tokens:** convivencia. Las clases nuevas consumen variables de `tokens.css`; el `:root` oscuro de `globals.css` se elimina (el diseño es solo claro).
10. **Mapbox:** se mantienen el marcador, los controles, el satélite, el 3D y la ruta; cambian solo los colores (ruta y marcador en `--green`).
11. **Sitemap y URLs** (`/properties/{hash}`) intactos: no se renombran rutas.
12. **reCAPTCHA:** el script se carga dos veces si el formulario de la ficha y el de tasación conviven; lo centralizo en un hook sin cambiar el flujo.

