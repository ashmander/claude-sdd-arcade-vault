# 02 — Pantalla Home

**Estado:** Approved
**Depende de:** SPEC 01
**Fecha:** 2026-09-04

**Objetivo:** Portar la pantalla Home (landing/marketing) del prototipo `references/home-about/home.jsx` a `/`, moviendo la Biblioteca actual a `/biblioteca` y actualizando la navegación, sin construir la pantalla "Acerca de".

## Alcance

**Incluye:**

- Nueva ruta `/` con la pantalla Home portada de `home.jsx`: hero con silhouettes flotantes, sección "¿POR QUÉ ARCADE VAULT?", rail de juegos destacados, stats, actividad en vivo (últimas puntuaciones + top jugadores), pricing/FAQ, y CTA final.
- Mover el contenido actual de `app/page.tsx` (Biblioteca) a `app/biblioteca/page.tsx`.
- Actualizar `components/nav.tsx`: agregar link "Inicio" apuntando a `/`, cambiar el link "Biblioteca" para apuntar a `/biblioteca`, y ajustar `isActive` en consecuencia. El link "Acerca de" del `nav.jsx` de referencia **no** se agrega en este spec.
- Portar a `app/globals.css` las reglas CSS de la sección `/* ===== HOME PAGE ===== */` de `references/home-about/styles.css` (desde `.home` hasta `.reveal.in`, antes de `/* ===== ABOUT PAGE ===== */`). No se porta la sección `/* ===== ABOUT PAGE ===== */`.
- Animación de aparición al hacer scroll (`useReveal` con `IntersectionObserver`) portada igual que en `home.jsx`.
- Todos los botones/CTAs de Home enlazan a rutas reales existentes: "EXPLORAR JUEGOS" y "VER TODOS LOS JUEGOS" y "INSERTAR MONEDA" → `/biblioteca`; "CREAR CUENTA" → `/auth`; cada mini-card de juego → `/juego/[id]`; "VER SALÓN →" → `/salon`.
- Datos de la sección "JUEGOS DISPONIBLES AHORA" (mini-cards) tomados de los primeros 6 elementos de `GAMES` (`lib/data.ts`). Datos de "TOP JUGADORES · HOY" tomados de `seededScores` (`lib/data.ts`) igual que se usa en el resto del proyecto. La lista de "ÚLTIMAS PUNTUACIONES" (ticker) usa datos estáticos de ejemplo iguales a los del template (no hay una fuente en `lib/data.ts` equivalente a ese ticker en tiempo real).
- Textos numéricos de la sección STATS ("12+ JUEGOS", "MILES DE PARTIDAS", "GLOBAL RANKING") se dejan como copy fijo, igual al template — no se calculan dinámicamente.
- Copy en español, igual al template.

**No incluye:**

- La pantalla "Acerca de" (`about.jsx`) — queda para un spec futuro. El link "Acerca de" no se agrega al Nav en este spec.
- El link "Acerca de" en el panel móvil del Nav tampoco se agrega.
- Cambios a las rutas ya implementadas de detalle, reproductor, auth o salón más allá de que ahora se enlazan desde Home.
- Backend, API routes o persistencia server-side (sigue siendo mock/localStorage, consistente con SPEC 01).
- Nuevas estructuras de datos: no se agregan campos ni tablas a `lib/data.ts` — se reutiliza `GAMES` y `seededScores` tal cual existen hoy.

## Modelo de datos

No se introduce ninguna estructura de datos nueva. Se reutilizan `Game`, `GAMES` y `seededScores` ya definidos en `lib/data.ts` (SPEC 01). El ticker de "ÚLTIMAS PUNTUACIONES" usa un array local estático dentro del componente Home (igual a los 7 registros de ejemplo de `home.jsx`), sin persistirse ni tipar en `lib/data.ts`.

## Plan de implementación

1. **Mover Biblioteca a `/biblioteca`:** crear `app/biblioteca/page.tsx` con el contenido actual de `app/page.tsx` (sin cambios de lógica). El sistema sigue funcionando: `/biblioteca` muestra la biblioteca; `/` momentáneamente queda con el placeholder de Next.js hasta el paso siguiente.
2. **Portar estilos del Home:** copiar el bloque `/* ===== HOME PAGE ===== */` de `references/home-about/styles.css` a `app/globals.css` (al final del archivo, antes o después de `/* misc */`, sin modificar selectores). Verificable: el CSS compila sin errores (`npm run dev` no rompe).
3. **Componente Home:** crear `components/home.tsx` (Client Component, `"use client"`) portando `home.jsx` — incluye `FloatingSilhouettes`, `MiniCard`, `FeatureIcon` y el hook `useReveal`. Reemplazar `navigate({name: ...})` por `next/link` (`<Link href="...">`) o `useRouter().push(...)` según corresponda a cada CTA. Conectar el rail de juegos a `GAMES.slice(0, 6)` y el bloque "TOP JUGADORES" a `seededScores`. Verificable: el componente compila y renderiza de forma aislada.
4. **Ruta `/`:** reemplazar `app/page.tsx` para que renderice `<Home />`. Verificable: `/` muestra la nueva pantalla Home con todas sus secciones, animaciones de reveal al hacer scroll, y silhouettes flotantes.
5. **Actualizar Nav:** en `components/nav.tsx`, agregar el link "Inicio" (`href="/"`), cambiar "Biblioteca" a `href="/biblioteca"`, y actualizar `isActive` para que "Inicio" esté activo solo en `pathname === "/"` y "Biblioteca" esté activo en `/biblioteca` y `/juego/*`. Aplicar el mismo cambio en el panel móvil. Verificable: navegar entre Inicio, Biblioteca, Salón de la Fama resalta correctamente el link activo en desktop y en el panel hamburguesa móvil.
6. **Verificación cruzada de CTAs:** confirmar manualmente que cada botón/enlace de Home navega a la ruta correcta (`/biblioteca`, `/auth`, `/salon`, `/juego/[id]`) y que las mini-cards usan el `id` real del juego.
7. **Pulido final:** revisar responsive de Home (hero, feature-grid, mini-rail, stats, activity-grid, pricing-grid) contra `references/home-about/arcade-vault-standalone.html` abierto en el navegador, y correr `npm run lint` sin errores.

## Criterios de aceptación

- [ ] `npm run dev` levanta la app y `/` muestra la pantalla Home (hero, why, juegos destacados, stats, actividad en vivo, pricing, CTA final) igual al template.
- [ ] `/biblioteca` muestra la biblioteca de juegos (mismo comportamiento que antes tenía `/`).
- [ ] El Nav muestra "Inicio" y "Biblioteca" como links separados, cada uno resaltado como activo en su ruta correspondiente, en desktop y en el panel móvil.
- [ ] El Nav no incluye un link "Acerca de".
- [ ] Los botones "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS" e "INSERTAR MONEDA" navegan a `/biblioteca`.
- [ ] El botón "CREAR CUENTA" navega a `/auth`.
- [ ] Cada mini-card del rail "JUEGOS DISPONIBLES AHORA" navega a `/juego/[id]` con el id correcto.
- [ ] El botón "VER SALÓN →" navega a `/salon`.
- [ ] Las secciones con la clase `reveal` aparecen con animación al hacer scroll (igual que en el template).
- [ ] `npm run lint` pasa sin errores.
- [ ] El diseño visual de Home (colores, tipografías, animaciones neón, silhouettes flotantes) coincide con `references/home-about/`.

## Decisiones tomadas y descartadas

- **Home reemplaza a `/`, Biblioteca se mueve a `/biblioteca`:** se descarta poner Home en una ruta secundaria (p.ej. `/inicio`) porque el nav del template distingue "Inicio" de "Biblioteca" como pantallas independientes, y `/` como landing es lo estándar para un sitio de marketing.
- **No se agrega el link "Acerca de" al Nav:** el usuario pidió explícitamente no construir la pantalla about en este spec; agregar el link dejaría una ruta rota (404). Se agregará en el spec que implemente `/about`.
- **Ticker de "ÚLTIMAS PUNTUACIONES" con datos estáticos, no generados:** no existe un helper equivalente en `lib/data.ts` para ese feed en tiempo real; se replica el array de ejemplo del template tal cual, consistente con el resto del proyecto que es mock/visual (SPEC 01).
- **Stats del hero como copy fijo:** se decide no acoplar "12+ JUEGOS" a `GAMES.length` para mantener el texto como copy de marketing, igual que en el template original.
- **Reutilizar `GAMES` y `seededScores` de `lib/data.ts`:** evita duplicar datos mock ya existentes y mantiene consistencia entre Home, Biblioteca y Salón de la Fama.

## Riesgos identificados

- **Enlaces rotos a `/` desde otras partes del código:** si algún componente existente asume que `/` es la Biblioteca (por ejemplo, redirecciones tras login o "volver al vault"), quedará apuntando ahora a Home en vez de a la lista de juegos. Mitigación: revisar durante el paso 6 todos los usos de `href="/"` o `router.push("/")` en el proyecto y decidir caso por caso si deben apuntar a `/biblioteca`.
- **Colisión de nombres de clase CSS entre Home y pantallas existentes:** varias clases del bloque HOME PAGE (`.home-section`, `.section-title`, etc.) son genéricas; un mismatch o colisión con estilos ya portados en SPEC 01 podría romper visualmente otra pantalla. Mitigación: comparar visualmente cada pantalla existente después de portar el CSS.
