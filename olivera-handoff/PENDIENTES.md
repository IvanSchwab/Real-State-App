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
