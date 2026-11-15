# PENDIENTES

Lo que queda para después de salir a producción. Se actualiza en cada paso del rediseño.

- [ ] Vista Mapa en el listado (botón Lista / Mapa oculto).
- [ ] Filtros que la API no soporta: superficie mínima, orden (Menor/Mayor precio, Mayor superficie), (`priceFrom` y `currency` sí funcionan en la API: el precio mínimo se puede sumar al listado).
- [ ] "Más filtros" (link oculto).
- [ ] Sección Características estructurada.
- [ ] Número de matrícula y colegio (TODO en config).
- [ ] Código público de la propiedad (TODO en config/helper; hoy se oculta `code`).
- [ ] Nota "Ubicación aproximada…" (no se publica hasta que confirme la inmobiliaria).
- [ ] Bloque de ubicación por zona sin dirección exacta (si se adopta la nota anterior).
- [ ] Remitente de Resend: `onboarding@resend.dev` → dominio propio (fuera de alcance).
- [ ] Eliminados por decisión: botón volver arriba, selector claro/oscuro del mapa, menú hamburguesa mobile (la navegación mobile queda en logo, lupa de código, WhatsApp y footer), campos Propietario/Teléfono/CP de la ficha.


- [ ] Decidir si se muestra la superficie cubierta (`buildingArea`) además de `landArea`.
- [ ] Decidir si el logo del Colegio de Martilleros (`public/images/colegio-martilleros.png`) vuelve al footer: el diseño no lo incluye y quedó afuera.
- [ ] Rate limit de `/api/sendEmail`: hoy no limita nada (la IP nueva nunca se guarda en el mapa). No se tocó para no cambiar el comportamiento en producción.
- [ ] Dormitorios "N o más": la API filtra por valor exacto (`bedrooms=N`). El diseño dice `1+`, `2+`; hoy se muestra `1`, `2`, `3`, `4`. Para el mínimo habría que pedirle a Mapaprop un parámetro nuevo o filtrar en el cliente.
- [ ] Sección "Conocé al equipo" (botón del bloque Nosotros): no hay página de destino, no se muestra.
- [ ] "Más filtros" del buscador del hero (oculto).
- [ ] reCAPTCHA: la clave de producción no acepta `localhost`. Para probar el envío de formularios en local hay que agregar `localhost` a los dominios de la clave en google.com/recaptcha/admin, o probar en un preview de Vercel.
- [ ] Listado: el encabezado no dice "ordenadas por más recientes" porque no se verificó el orden por defecto de la API (hoy muestra total y página).
- [ ] Listado: el selector de superficie mínima y el de orden siguen ocultos (la API no los soporta); el precio mínimo y la moneda ya se usan.
- [ ] Mapbox: el token está restringido por dominio y responde 403 desde `localhost` (no cargan los tiles ni la geocodificación). Para probar el mapa y "Calcular ruta" en local, agregar `http://localhost:3000` a las URLs permitidas del token en account.mapbox.com, o probar en un preview de Vercel. Verificar en producción que se dibuja el mapa, la ruta, el satélite y el 3D.
- [ ] Ficha: Open Graph / título por propiedad para las vistas previas al compartir (hoy la ficha se renderiza en el cliente; el título de la pestaña sí se actualiza).
- [ ] Ficha: no se muestran propietario, teléfono del propietario ni código postal (el diseño los reemplaza por la tarjeta de la oficina).
- [ ] Ficha: el visor reemplaza al modal "+N más": ahora trae una tira con todas las miniaturas.
- [ ] Ficha: dependencias sin uso (`react-magnifying-glass`, `leaflet`, `react-leaflet`, `react-map-gl`, `aos`, `react-awesome-reveal`, `react-google-recaptcha`, `resend`) quedaron en `package.json`; se pueden quitar en un cambio aparte.

---

## Checklist de aceptación del HANDOFF: estado al cierre del rediseño

Verificado en la rama `redesign` (build y lint sin errores):
- [x] Barra superior, tarjeta de contacto de la ficha y filtros del listado quedan fijos al scrollear (probado: filtros a 104 px, barra a 0).
- [x] Precios siempre con moneda y separador de miles; specs solo si son mayores a 0 (probado con datos reales, incluidos `bedrooms: -1` y `0`).
- [x] WhatsApp: todos los CTA abren el chat; desde la ficha, con el mensaje precargado.
- [x] Buscar por código (barra y modal en celular, probado con `1584-1`), compartir y filtros/orden en la URL (el orden queda pendiente, ver arriba).
- [x] `prefers-reduced-motion`: tokens.css apaga animaciones y transiciones; el subrayado del titular, los contadores y `Reveal` quedan estáticos y visibles.
- [x] Sin textos con tuteo (búsqueda en `app`, `components`, `lib`, `config` y `pages`).
- [x] Accesibilidad auditada en el navegador (Home, listado y ficha): todos los controles con nombre accesible, imágenes con `alt`, un solo `h1`, `lang="es"` y controles de 44 px o más.
- [x] Imágenes con `loading="lazy"`; el hero, el logo y la primera foto de cada pantalla con prioridad.

Sin verificar (requiere entorno que acá no estaba disponible):
- [ ] Lighthouse mobile (Accesibilidad ≥ 95): no se pudo correr; la auditoría manual de arriba cubre nombres, alt y tamaño de controles, pero no contraste calculado.
- [ ] Comparación pixel a pixel contra `preview/` a 1440 px y 390 px reales (se comparó en un iframe escalado y a 600–735 px).
- [ ] Mapa y "Calcular ruta" (token de Mapbox restringido por dominio).
- [ ] Envío real de los formularios a Resend (reCAPTCHA no acepta `localhost`).
- [ ] Contadores animados en una pestaña en primer plano.
