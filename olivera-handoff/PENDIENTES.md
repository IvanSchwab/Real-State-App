# PENDIENTES

Lo que queda para después de salir a producción. Se actualiza en cada paso del rediseño.

- [ ] Vista Mapa en el listado (botón Lista / Mapa oculto).
- [ ] Filtros que la API no soporta: superficie mínima, orden (Menor/Mayor precio, Mayor superficie), precio mínimo (verificar `priceFrom`).
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
