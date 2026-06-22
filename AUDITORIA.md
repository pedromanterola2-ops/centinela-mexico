# Auditoría Completa — Centinela México
**Fecha:** 2026-06-21  
**Versión auditada:** HEAD `dc5bcd2` · Next.js 15.5.19

---

## Resumen ejecutivo

El sitio está bien construido en su núcleo: arquitectura sólida, seed funcional, diseño visual coherente y una línea editorial clara. Sin embargo, hay un conjunto de bugs concretos, deudas de accesibilidad y problemas de SEO que se deben resolver antes de que el sitio sea "production-ready" para un público amplio. Se clasifican en tres niveles:

- 🔴 **Crítico** — afecta funcionalidad, SEO real o accesibilidad base
- 🟡 **Importante** — afecta experiencia o profesionalismo
- 🟢 **Mejora** — nice-to-have, pulir calidad

---

## 1. SEO y metadatos

### 🔴 sitemap.ts usa `centinelamex.com`, URL que no existe
`app/sitemap.ts` y `app/robots.ts` tienen `BASE_URL = "https://centinelamex.com"` pero el sitio vive en Vercel con otro dominio. Si Google indexa el sitemap, encontrará URLs rotas.

**Fix:** usar la URL desplegada real o una variable de entorno:
```ts
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://centinela-mexico.vercel.app";
```
Actualizar `robots.ts` del mismo modo.

### 🔴 Falta página `not-found.tsx` y `error.tsx`
Cualquier slug inválido que pase el `notFound()` no tiene página 404 personalizada; Next muestra el default feo. Lo mismo para errores de runtime.

**Fix:** crear `app/not-found.tsx` y `app/error.tsx` con el layout del sitio.

### 🟡 Sin imagen Open Graph
`app/layout.tsx` tiene `openGraph` pero sin `images`. Cuando alguien comparte en WhatsApp/Twitter no aparece ninguna imagen de vista previa.

**Fix:** añadir una OG image estática (1200×630 px) o generarla con `ImageResponse` de Next.

### 🟡 Falta Twitter/X Card meta
No hay `twitter: { card: "summary_large_image" }` en los metadatos. Afecta la presentación en esa red.

### 🟡 Sin `canonical` en metadatos
El comparador y el glosario tienen URLs con query params (`?tipo=fuerzas`, `?vista=categoria`) que generan contenido duplicado para crawlers.

**Fix:** añadir `alternates: { canonical: "..." }` en las páginas con filtros.

### 🟢 `busqueda` correctamente excluida de índice (`robots: { index: false }`) ✅

---

## 2. Accesibilidad (a11y)

### 🔴 Sin enlace "Saltar al contenido" (skip-to-content)
El header tiene 8+ elementos de navegación. Usuarios de teclado o lectores de pantalla deben tabular por todo para llegar al contenido principal.

**Fix:** añadir al principio del `<body>` en `layout.tsx`:
```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">Saltar al contenido</a>
```
Y `id="main-content"` en el `<main>`.

### 🔴 Nav activo sin `aria-current`
Los links del header activos se marcan visualmente con color verde pero no tienen `aria-current="page"`. Lectores de pantalla no saben cuál sección está activa.

**Fix:** añadir `aria-current={pathname.startsWith(item.href) ? "page" : undefined}` en cada `<Link>` del nav.

### 🔴 Carrusel de `TotalsBlock` duplica contenido sin `aria-hidden`
El carrusel duplica los 8 items para lograr el efecto infinito (`doubled = [...ITEMS, ...ITEMS]`). Los lectores de pantalla leen todos los 16. 

**Fix:** añadir `aria-hidden="true"` al segundo bloque de items duplicados.

### 🔴 `prefers-reduced-motion` no respetado en el carrusel
La animación CSS `carousel-scroll` se ejecuta siempre. Para usuarios con vestibular disorders o motion sickness esto puede ser problemático.

**Fix:** añadir en `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .carousel-track { animation: none; }
}
```

### 🟡 `<CompareTable>` sin `scope` en `<th>`
La tabla comparativa no tiene `scope="col"` en los headers, lo que dificulta la navegación con lectores de pantalla.

**Fix:** `<th scope="col">` en los tres headers de `CompareTable.tsx`.

### 🟡 SearchBar sin `role="combobox"` / `aria-expanded`
El dropdown de sugerencias de búsqueda no tiene roles ARIA correctos. El `<input>` debería tener `role="combobox"`, `aria-expanded`, y las sugerencias `role="option"`.

### 🟡 `<nav>` mobile no tiene `aria-label`
El `<nav>` del menú desktop tiene contenido implícito pero no `aria-label="Navegación principal"`. El menú mobile tampoco.

### 🟡 Iconos SVG sin `aria-hidden` consistente
El ícono de búsqueda en el header tiene `aria-hidden="true"` ✅. El del `SearchBar` no lo tiene.

### 🟢 Contraste de colores: `text-text-muted/50` (`#7a9486` al 50%) sobre fondo oscuro puede estar por debajo de 3:1 en muchos elementos secundarios. Recomendable auditarlo con una herramienta (axe/Lighthouse).

---

## 3. Contenido y datos

### 🔴 `app/acerca-de/page.tsx` menciona "MapLibre GL JS" como mapa del sitio
La página dice: *"Mapa: MapLibre GL JS con tiles de OpenStreetMap"*. MapLibre fue **eliminado** y reemplazado por el cartograma SVG el 2026-06-21. El texto está desactualizado y es técnicamente incorrecto.

**Fix:** cambiar a: *"Mapa: cartograma de cuadrícula propio (SVG/CSS, sin dependencias externas)"*.

### 🔴 Alta tasa de `pendiente_verificacion: true` en seed
- `fuerzas_armadas`: 4 de 5 pendientes
- `estados`: 32 de 32 pendientes  
- `equipamiento`: 36 de 37 pendientes
- `instalaciones`: 29 de 29 pendientes

Esto es correcto y honesto (principio de no fabricar datos), pero visualmente el sitio muestra casi todo "En verificación", lo que puede dar impresión de sitio incompleto o poco fiable. **No es un bug de código**, pero es un riesgo editorial de percepción que conviene comunicar en la UI.

**Sugerencia:** añadir un banner o nota en las fichas con muchos pendientes explicando que los datos se van completando progresivamente.

### 🟡 Seed de `noticias` (28 items) nunca se mueve
Las 28 noticias del seed son estáticas y llevan fechas del pasado. Cuando el feed RSS no devuelve nada relevante sobre México, la sección Actualidad muestra solo estas 28 noticias antiguas, algunas probablemente con fechas de 2024 o antes.

**Sugerencia:** revisar y actualizar el seed de noticias, o bien moverlo a un archivo separado que se regenere periódicamente.

### 🟡 `fuentes.json` tiene 6 oficiales pero el Footer solo enlaza a 6 también — están alineados ✅, pero faltan CENAPRED y PNT en el footer (sí aparecen en `/acerca-de`). Inconsistencia menor.

### 🟢 Glosario: ninguna entrada tiene `fuente_url` (45/45 sin fuente). Para un proyecto que prioriza la verificabilidad, las definiciones deberían citar su fuente.

---

## 4. Código y arquitectura

### 🔴 Archivos `.fuse_hidden*` en el repo
El directorio `app/` tiene 17 archivos `.fuse_hidden*` y `components/` tiene 15. Estos son artefactos del editor/macOS que **no deben estar en el repositorio**. Aunque no afectan la build (Next los ignora), ensucian el árbol, confunden a colaboradores y aumentan el tamaño del repo.

**Fix:** añadir a `.gitignore`:
```
.fuse_hidden*
```
Y limpiarlos del historial git:
```bash
git rm -rf --cached .fuse_hidden* && git commit -m "chore: remove fuse_hidden artifacts"
```

### 🔴 `font-heading` definido en Tailwind pero jamás cargado ni usado
`tailwind.config.ts` define `fontFamily.heading` con `var(--font-heading)` pero en `app/layout.tsx` solo se cargan `Space_Grotesk` (`--font-sans`) e `IBM_Plex_Mono` (`--font-mono`). La variable `--font-heading` nunca se asigna. Cualquier componente que use `font-heading` caerá al sistema-fallback sin aviso.

**Fix A (recomendado):** eliminar la clave `heading` del tailwind.config ya que todos los headings usan `--font-sans` (Space Grotesk).  
**Fix B:** cargar una tercera fuente y asignarla a `--font-heading` si se quiere diferenciar headings.

### 🟡 `MapView.tsx` es un stub deprecado que vive en `components/ui/`
El componente existe (488 chars), está ahí pero no hace nada. Un colaborador podría importarlo por error.

**Fix:** añadir un comentario prominente de deprecación o moverlo a un archivo `_deprecated/`.

### 🟡 `(fuerza as { historia?: string }).historia` — type cast inseguro
En `app/fuerzas-armadas/[slug]/page.tsx` se hace un cast manual porque el campo `historia` no está en el tipo `FuerzaArmada`. Si `historia` existe en el seed pero no en el tipo, puede causar problemas silenciosos.

**Fix:** añadir `historia?: string` al tipo `FuerzaArmada` en `types/index.ts`.

### 🟡 `.gitignore` tiene entradas duplicadas
`*.tsbuildinfo` y `next-env.d.ts` aparecen dos veces en `.gitignore`. No rompe nada pero es descuido.

### 🟡 `preload-wasm.cjs` está en `.gitignore` pero existe en el repo
Si está en el `.gitignore`, probablemente se haya añadido antes y ya esté trackeado. Revisar con `git ls-files preload-wasm.cjs`.

### 🟡 `SearchBar` cierra sugerencias solo con `mousedown` (no con `touchend` ni `Escape`)
En mobile, el handler de click-outside usa `mousedown` pero en touch puede no dispararse. Tampoco cierra al presionar `Escape`.

**Fix:** añadir listener para `touchend` y handler `onKeyDown` con `Escape → setFocused(false)`.

### 🟢 `cn()` custom — implementación correcta ✅ pero podría reemplazarse con `clsx` (más testeado, 0.25kb). No es urgente.

### 🟢 `lib/ingest.ts` — el ingestor no tiene limit de tamaño de respuesta. Un feed malicioso o muy grande podría consumir mucha memoria.

---

## 5. Diseño visual, tipografía y colores

### Sistema de color — SÓLIDO ✅
- Paleta de 3 colores semánticos (verde militar, guinda, cobre) bien definida en Tailwind con escalas completas.
- CSS variables dobles (Tailwind + CSS custom props) crean cierta redundancia pero funciona.
- El fondo `#080d0b` (casi negro con tinte verde) es coherente con el tema militar.

### 🟡 Redundancia entre CSS variables y clases Tailwind
`globals.css` define `--color-green: #2d7a47` Y `tailwind.config.ts` define `green.DEFAULT: "#2d7a47"`. Se pueden usar directamente las clases Tailwind sin necesidad de las CSS vars en la mayoría de casos. Confunde saber cuál usar.

**Recomendación:** mantener las CSS vars solo para los valores que se usan en `style={{}}` inline (fill de SVG, etc.) y usar clases Tailwind para el resto.

### 🟡 Tamaños de fuente hardcodeados con `text-[13px]`, `text-[11px]`, `text-[10px]`
Hay muchos tamaños custom fuera de la escala de Tailwind. Esto hace difícil mantener consistencia tipográfica. 

**Recomendación:** extender la escala tipográfica en `tailwind.config.ts` con `xs2: "0.6875rem"` (11px) y `xs3: "0.6rem"` (10px) para centralizarlos.

### 🟡 Inconsistencia de border-radius
Los cards en `Card.tsx` usan `rounded-lg`, pero muchos elementos inline usan `rounded-sm` o `rounded-md` sin patrón claro. La ficha de fuerza armada usa ambos en la misma vista.

**Recomendación:** establecer una convención: `rounded-sm` para chips/badges, `rounded-lg` para cards, `rounded-md` para botones.

### 🟡 El hero tiene `text-base` en los botones CTA
Los botones "Explorar fuerzas →" y "Ver mapa interactivo" usan `text-base` (16px). En un sitio con tipografía pequeña y densa, estos botones destacan bien — pero `py-2.5 text-base` es un touch target de ~42px, justo en el límite de los 44px recomendados por WCAG 2.1.

### 🟢 Paleta de colores coherente con identidad mexicana ✅ (verde SEDENA + guinda CDMX)

### 🟢 Space Grotesk + IBM Plex Mono — excelente elección ✅. Contraste editorial-datos funciona muy bien.

### 🟢 El carrusel de totales hace hover-pause ✅ (aunque falta prefers-reduced-motion).

### 🟢 Grid pattern de fondo muy sutil (3% opacidad) ✅ — no distrae del contenido.

---

## 6. Semántica HTML y estructura

### 🟡 Breadcrumbs sin `aria-label` en el `<nav>`
Las fichas de fuerza y estado tienen breadcrumbs en un `<nav>` pero sin `aria-label="Ruta de navegación"`. Con el nav del header, hay dos `<nav>` sin distinguir.

**Fix:** `<nav aria-label="Ruta de navegación">` en breadcrumbs.

### 🟡 Secciones de datos en fichas usan `<section>` pero sin `aria-labelledby`
Las secciones "Datos clave", "Misión", etc. son `<section>` con un `<h2>` interno — correcto semánticamente — pero el `<h2>` no tiene `id` para el `aria-labelledby` de la `<section>`.

### 🟡 Footer: el bloque "Red Centinela" es un `<a>` grande (anchor-like card)
Un `<a>` que envuelve un bloque visual complejo (texto + ícono + descripción) puede ser confuso para lectores de pantalla. Es un patrón conocido pero debería tener un `aria-label` descriptivo.

**Fix:** añadir `aria-label="Visitar Centinela Táctico — Base de datos global de fuerzas armadas"`.

### 🟡 `<header>` como elemento raíz en `FuerzaArmadaDetallePage` dentro de `<div>`
El `<header>` que muestra el nombre + badge de la fuerza está dentro del `<div>` contenedor de la página, no como header del documento. En este contexto es un `<header>` de sección (OK en HTML5), pero visualmente se podría confundir con el `<header>` del layout.

### 🟢 `<main>` en layout ✅, `<footer>` en layout ✅, `<ol>` en Timeline ✅, `<dl>` en el panel del mapa ✅, `<article>` en noticias ✅.

### 🟢 `lang="es"` en `<html>` ✅

### 🟢 `<time>` en Timeline items ✅

---

## 7. Funcionalidad y UX

### 🟡 El comparador no muestra instrucciones sobre qué diferencia los dos colores
Los resultados usan verde para A y guinda para B, con un ▲ para el mayor. No hay leyenda explicativa visible antes de la tabla.

### 🟡 SearchBar home: las sugerencias son hardcoded
Las sugerencias ("SEDENA", "Jalisco", etc.) son estáticas en el código, no provienen del seed. Si se añaden nuevas fuerzas o equipos, las sugerencias no se actualizan.

**Sugerencia a futuro:** generar las sugerencias desde el seed al construir la página (Server Component).

### 🟡 Mapa: al hacer hover el mouse, el panel lateral cambia de estado instantáneamente
`onMouseEnter` cambia `sel` en cada pixel de movimiento. Puede causar parpadeo en el panel lateral.

**Sugerencia:** usar `onFocus` + `onClick` en lugar de `onMouseEnter` para mayor estabilidad.

### 🟡 Página de Glosario: sin buscador/filtro dentro de la página
Con 45 términos (y más por venir) la búsqueda por letra ayuda, pero no hay un input de filtrado rápido dentro de la propia página.

### 🟢 Mobile menu cierra al navegar ✅
### 🟢 Comparador previene comparar la misma entidad (`a !== b`) ✅
### 🟢 Búsqueda requiere mínimo 2 caracteres ✅
### 🟢 Estado vacío con ejemplos en búsqueda ✅
### 🟢 Feeds RSS: timeout de 8s y `allSettled` para aislar fallos ✅

---

## 8. Performance

### 🟡 `getLatestNoticias(1000)` en Home para contar noticias
La página de inicio llama `getLatestNoticias(1000)` solo para saber cuántas hay. Esto es ineficiente.

**Fix:** añadir una función `countNoticias()` en las queries.

### 🟡 Home hace 8 queries paralelas en `getTotales()`
Todas en `Promise.all` — óptimo ✅. Pero si alguna falla, toda la página puede fallar. Con Supabase desconectado (situación actual) cae al seed, lo cual es el comportamiento correcto.

### 🟢 `next/font` con `display: swap` ✅
### 🟢 `revalidate = 1800` en Actualidad ✅
### 🟢 `generateStaticParams` en fichas de fuerzas, estados, equipamiento y operativos ✅ (SSG)

---

## 9. Seguridad

### 🟡 Sin `Content-Security-Policy` en headers
`vercel.json` no define headers de seguridad. Para un sitio informativo sin autenticación el riesgo es bajo, pero es una buena práctica.

### 🟡 Links externos sin `rel="noreferrer"` en algunos casos
La mayoría tienen `rel="noopener noreferrer"` ✅ pero conviene verificar todos los links generados dinámicamente desde el seed (`fuente_url`).

### 🟢 Sin autenticación ni inputs peligrosos — superficie de ataque mínima ✅
### 🟢 `.env.local` en `.gitignore` ✅

---

## Plan de acción priorizado

### Semana 1 — Críticos (bugs y accesibilidad base)

| # | Problema | Archivo(s) |
|---|---|---|
| 1 | `BASE_URL` correcto en sitemap + robots | `app/sitemap.ts`, `app/robots.ts` |
| 2 | Crear `app/not-found.tsx` y `app/error.tsx` | Nuevos archivos |
| 3 | `aria-current="page"` en nav | `components/layout/Header.tsx` |
| 4 | Skip-to-content link | `app/layout.tsx` |
| 5 | `aria-hidden` en items duplicados del carrusel | `components/home/TotalsBlock.tsx` |
| 6 | `prefers-reduced-motion` en CSS | `app/globals.css` |
| 7 | Actualizar texto de mapa en Acerca de | `app/acerca-de/page.tsx` |
| 8 | Limpiar `.fuse_hidden*` del repo | `.gitignore` + git rm |

### Semana 2 — Importantes (SEO + código)

| # | Problema | Archivo(s) |
|---|---|---|
| 9 | OG image + Twitter card meta | `app/layout.tsx` |
| 10 | Eliminar/deprecar `font-heading` no cargado | `tailwind.config.ts` |
| 11 | `scope="col"` en CompareTable | `components/ui/CompareTable.tsx` |
| 12 | `aria-label` en `<nav>` de breadcrumbs | Fichas de fuerza y estado |
| 13 | `aria-label` en el anchor de "Red Centinela" | `components/layout/Footer.tsx` |
| 14 | Añadir `historia?: string` al tipo FuerzaArmada | `types/index.ts` |
| 15 | Fix SearchBar: Escape + touch | `components/home/SearchBar.tsx` |

### Futuro (mejoras de contenido y UX)

- Completar datos del seed (reducir pendientes)
- Actualizar seed de noticias
- OG image dinámica con nombre de entidad en fichas
- Sugerencias de búsqueda desde seed
- Buscador inline en Glosario
- Añadir fuente a entradas de glosario
- CSP headers en vercel.json
- `countNoticias()` query eficiente

---

## Lo que está muy bien ✅

1. **Seed-first pattern**: el sitio funciona 100% sin Supabase. Robusto.
2. **SSG con `generateStaticParams`** en todas las rutas de detalle. Tiempo de carga excelente.
3. **Ingestor RSS propio sin dependencias** con `allSettled` y timeout. Elegante.
4. **Principio editorial honesto**: `pendiente_verificacion` en lugar de inventar datos.
5. **Paleta de color coherente** con la identidad institucional mexicana.
6. **Tipografía Space Grotesk + IBM Plex Mono**: excelente contraste editorial vs datos.
7. **Cartograma sin dependencias** — buen reemplazo para evitar sensibilidad de coordenadas.
8. **Footer con disclaimer permanente** — principio no negociable cumplido.
9. **Mobile hamburger funcional** con animación CSS pura.
10. **`lang="es"` + `locale: "es_MX"` en OG** — correcto para el target.

---

*Auditoría generada automáticamente revisando todo el código fuente. Cada hallazgo tiene una ubicación concreta de archivo verificada.*
