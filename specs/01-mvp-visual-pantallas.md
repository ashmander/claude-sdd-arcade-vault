# 01 — MVP visual: pantallas de Arcade Vault

**Estado:** Implemented
**Depende de:** —
**Fecha:** 2026-09-03

**Objetivo:** Portar las 5 pantallas del prototipo estático en `references/templates/` (biblioteca, detalle de juego, reproductor, autenticación, salón de la fama) a rutas reales de Next.js 16 App Router, replicando fielmente su diseño e interacciones visuales sin implementar ningún juego real.

## Alcance

**Incluye:**

- 5 rutas bajo `app/`: biblioteca (`/`), detalle de juego (`/juego/[id]`), reproductor simulado (`/juego/[id]/jugar`), salón de la fama (`/salon`), autenticación (`/auth`).
- Navegación (`Nav`) con menú desktop y panel móvil (hamburguesa), igual que `nav.jsx`.
- Datos mock (`GAMES`, `CATS`, `seededScores`) portados a un módulo TypeScript tipado.
- Auth mock: login/registro/invitado que guarda `{ name }` en `localStorage`, sin backend ni validación real de credenciales.
- Guardado de puntuaciones mock en `localStorage` al terminar una partida simulada.
- Reproductor simulado: HUD (jugador, puntuación, vidas, nivel), pantalla "CRT" con incremento automático de puntaje falso, pausa, fin de partida y modal para guardar puntuación — igual que `reproductor.jsx`, sin lógica de juego real.
- Estilos: se porta `styles.css` (variables, animaciones neón/CRT, layout) tal cual a `app/globals.css`, conviviendo con Tailwind v4.
- Fuentes (Press Start 2P, Courier Prime, JetBrains Mono) cargadas con `next/font/google` en `app/layout.tsx`.
- Textos de interfaz en español, igual que el template.

**No incluye:**

- Ningún juego jugable real (Bloque Buster, Caída, Serpentina, etc.) — el "reproductor" sigue siendo una simulación visual de puntaje aleatorio, no una implementación jugable.
- Backend, base de datos, API routes o autenticación real (OAuth de Google/GitHub son botones puramente decorativos, sin funcionalidad).
- Persistencia de puntuaciones más allá de `localStorage` del navegador (sin sincronización entre dispositivos ni usuarios).
- Multijugador local (mencionado en la descripción de "DUELO PIXEL") — queda fuera de este MVP.
- `loading.tsx` o `not-found.tsx` personalizados — se usan los defaults de Next.js.
- Tests automatizados (no hay test runner configurado en el proyecto).

## Modelo de datos

Módulo `lib/data.ts` (reemplaza `data.jsx`), con exports nombrados y tipados:

```ts
export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
  cover: string;
  color: "cyan" | "magenta" | "green" | "yellow";
  best: number;
  plays: string;
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;
}

export const GAMES: Game[];
export const CATS: string[]; // ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
export function seededScores(seed: number, count?: number): ScoreRow[];
```

Datos de sesión en `localStorage` (mismas claves que el template):

- `av_user`: `{ name: string } | null`
- `av_scores`: `Array<{ game: string; score: number; name: string; at: number }>`

No hay nuevas estructuras persistidas en servidor — todo vive en el cliente.

## Plan de implementación

1. **Base del proyecto:** crear `lib/data.ts` portando `GAMES`, `CATS`, `PLAYERS` y `seededScores` de `data.jsx` con tipos TypeScript. Copiar `styles.css` a `app/globals.css` (o a un archivo `app/av-theme.css` importado desde `globals.css`), preservando selectores y animaciones. Configurar las 3 fuentes con `next/font/google` en `app/layout.tsx`. El sistema sigue arrancando (`npm run dev`) mostrando el scaffold sin romper nada.
2. **Layout y navegación:** crear `components/nav.tsx` (Client Component, `"use client"`) portando `nav.jsx` — usa `usePathname()` de `next/navigation` en vez de `route.name` para resaltar el link activo, y `next/link` para navegar. Leer/escribir `av_user` de `localStorage` con `useState`+`useEffect`. Montar `Nav` y el `<footer>` en `app/layout.tsx`. Verificable: la navegación aparece en cualquier ruta placeholder.
3. **Biblioteca (`/`):** crear `components/game-card.tsx` y `app/page.tsx` (Client Component) portando `biblioteca.jsx` — buscador, chips de categoría, grid de tarjetas con tilt al hover, `next/link` hacia `/juego/[id]`. Verificable: `/` reproduce visualmente la biblioteca del template, con filtro y búsqueda funcionando.
4. **Detalle de juego (`/juego/[id]`):** crear `app/juego/[id]/page.tsx` como Server Component `async` que hace `const { id } = await params`, resuelve el `Game` desde `lib/data.ts` y llama `notFound()` si no existe; pasa los datos a `components/game-detalle.tsx` (Client o Server según necesidad) portando `detalle.jsx` (tags, sinopsis, stat strip, leaderboard con `seededScores`, botones "Jugar ahora" / "Volver al Vault"). Verificable: cada id de `GAMES` renderiza su página de detalle con datos correctos; un id inexistente da 404 estándar de Next.js.
5. **Reproductor simulado (`/juego/[id]/jugar`):** crear `app/juego/[id]/jugar/page.tsx` (Server Component que resuelve `id`/`notFound()`) + `components/reproductor.tsx` (Client Component) portando `reproductor.jsx` completo: HUD, `crt-screen` con `setInterval` de puntaje falso, pausa, fin de partida, modal de guardar puntuación (escribe en `localStorage` vía un helper `saveScore` en `lib/scores.ts`), botones de reinicio/salida. Verificable: se puede "jugar", pausar, terminar la partida, guardar la puntuación y ver el toast de confirmación.
6. **Autenticación (`/auth`):** crear `components/auth.tsx` (Client Component) portando `auth.jsx` — tabs iniciar sesión/crear cuenta, formulario mock, botón de invitado, botones sociales decorativos. Al enviar, guarda `av_user` en `localStorage` y redirige a `/` con `useRouter().push`. Verificable: tras "iniciar sesión" o "invitado", el Nav muestra el nombre del usuario y persiste tras recargar la página.
7. **Salón de la fama (`/salon`):** crear `components/salon.tsx` (Client Component) portando `salon.jsx` — tabs por juego, podio (oro/plata/bronce), tabla de posiciones, fila destacada del usuario si hay sesión iniciada. Verificable: cambiar de tab por juego recalcula el podio/tabla; con sesión iniciada aparece la fila "tu mejor marca".
8. **Pulido final:** revisar responsive (mobile nav, grid de biblioteca, columnas de detalle) contra el template abriendo `references/templates/Arcade Vault.html` en el navegador como referencia visual, y correr `npm run lint` sin errores.

## Criterios de aceptación

- [X] `npm run dev` levanta la app y `/` muestra la biblioteca de juegos con búsqueda y filtro por categoría funcionando.
- [X] Cada tarjeta de juego navega a `/juego/[id]` mostrando sinopsis, stats y tabla de mejores puntuaciones.
- [X] `/juego/[id]/jugar` muestra el HUD, incrementa el puntaje automáticamente, permite pausar, terminar la partida y guardar una puntuación con iniciales.
- [X] Tras guardar una puntuación, `localStorage` contiene la entrada bajo la clave `av_scores`.
- [X] `/auth` permite iniciar sesión, crear cuenta o entrar como invitado; el nombre de usuario aparece en el `Nav` y persiste tras recargar (clave `av_user` en `localStorage`); cerrar sesión limpia el estado.
- [X] `/salon` muestra podio y tabla de posiciones por juego, con tabs que cambian el juego mostrado.
- [X] La navegación (`Nav`) resalta la sección activa y el menú hamburguesa funciona en viewport móvil.
- [X] Ningún juego (Bloque Buster, Caída, Serpentina, etc.) tiene lógica jugable real — el reproductor solo simula puntaje.
- [X] `npm run lint` pasa sin errores.
- [X] El diseño visual (colores, tipografías, animaciones neón/CRT) coincide con `references/templates/`.

## Decisiones tomadas y descartadas

- **Rutas de archivo reales en vez de hash routing:** se descarta replicar el router manual de `app.jsx` porque el proyecto ya usa App Router; usar rutas reales es más idiomático para Next.js 16 y necesario para SEO/enlaces directos, aunque implica reescribir la navegación basada en `route.name`.
- **CSS custom importado tal cual, sin convertir a Tailwind:** se descarta reescribir ~950 líneas de CSS a utilidades Tailwind en este MVP porque el objetivo es replicar el diseño exacto rápido; una futura iteración podría migrar a Tailwind si se necesita.
- **Simulación de puntaje falso se mantiene:** no se interpretó "no implementar ningún juego" como "quitar la animación del reproductor", porque esa animación ya es parte del diseño visual del template (no es un juego real, es un placeholder de HUD).
- **Mock de auth y puntuaciones vía `localStorage`, sin backend:** consistente con "solamente es la parte visual" — no se crean API routes ni base de datos en este spec.
- **Nombres de archivo/ruta en español:** se mantiene la convención del template (`biblioteca`, `detalle`, `reproductor`, `salon`, `auth`) para consistencia con el copy en español de la app.
- **`params` como `Promise` en rutas dinámicas:** confirmado contra la documentación de Next.js 16 en `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` — las páginas de `/juego/[id]` y `/juego/[id]/jugar` deben ser `async` y hacer `await params`.

## Riesgos identificados

- **Fidelidad visual:** al portar CSS escrito para clases JSX específicas, un mismatch de nombre de clase entre el componente portado y `globals.css` puede romper silenciosamente un estilo. Mitigación: comparar cada pantalla contra `references/templates/Arcade Vault.html` abierta en el navegador durante el paso 8.
- **Hidratación de `localStorage`:** leer `av_user`/`av_scores` en el primer render de un Client Component puede causar mismatch de hidratación SSR/cliente. Mitigación: inicializar el estado en `useEffect` (como ya hace `app.jsx` original) en vez de leer `localStorage` durante el render inicial del Server Component.
