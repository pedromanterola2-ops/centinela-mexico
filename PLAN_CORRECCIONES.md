# Plan de correcciones — Centinela México
**Basado en:** AUDITORIA.md · 2026-06-22  
**Regla:** cada fase se ejecuta y confirma con `npx tsc --noEmit` + `npx next lint` antes de avanzar.  
**Push:** después de cada fase, commit + push desde la terminal del Mac.

---

## Fase A — Limpieza sin riesgos
> **Estimado:** ~30 min · Sin cambios de lógica, solo texto y configuración.  
> **Riesgo:** mínimo — nada puede romper la app.

### A1 · Corregir `BASE_URL` en sitemap y robots
**Archivos:** `app/sitemap.ts`, `app/robots.ts`

```ts
// app/sitemap.ts — línea 9
// ANTES:
const BASE_URL = "https://centinelamex.com";
// DESPUÉS:
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://centinela-mexico.vercel.app";
```
Hacer lo mismo en `app/robots.ts` (la línea del sitemap URL).

> También agregar `NEXT_PUBLIC_SITE_URL=https://centinela-mexico.vercel.app` en las Variables de Entorno de Vercel (Settings → Environment Variables) para cuando se tenga dominio propio.

---

### A2 · Actualizar texto del mapa en Acerca de
**Archivo:** `app/acerca-de/page.tsx`

Buscar:
```
Mapa: <span className="text-text">MapLibre GL JS</span> con tiles de OpenStreetMap.
```
Reemplazar con:
```
Mapa: <span className="text-text">Cartograma SVG propio</span>, sin dependencias externas.
```

---

### A3 · Limpiar archivos `.fuse_hidden*` del repo
**Archivos:** `.gitignore` + ejecución en terminal

Paso 1 — añadir al final de `.gitignore`:
```
# Artefactos del sandbox/editor
.fuse_hidden*
```

Paso 2 — desde la terminal del Mac:
```bash
cd ~/Claude/Projects/ARSENALMÉXICO
git rm -rf --cached $(git ls-files | grep .fuse_hidden)
git add .gitignore
git commit -m "chore: remove .fuse_hidden artifacts, update .gitignore"
git push origin main
```

---

### A4 · Eliminar `font-heading` huérfano de Tailwind
**Archivo:** `tailwind.config.ts`

La variable `--font-heading` nunca se carga en `layout.tsx` ni se usa en ningún componente. Eliminar la clave para evitar confusión:

```ts
fontFamily: {
  sans: ["var(--font-sans)", "system-ui", "sans-serif"],
  // ← ELIMINAR la línea: heading: [...]
  mono: ["var(--font-mono)", "monospace"],
},
```

---

### A5 · Limpiar `.gitignore` con entradas duplicadas
**Archivo:** `.gitignore`

Actualmente `*.tsbuildinfo` y `next-env.d.ts` aparecen dos veces. Dejar solo una ocurrencia de cada uno.

---

**✅ Verificación Fase A:**
```bash
npx tsc --noEmit && npx next lint
# commit: "fix(fase-a): URL sitemap, texto mapa, fuse_hidden, tailwind cleanup"
```

---

## Fase B — Accesibilidad base (a11y)
> **Estimado:** ~1.5 horas · Cambios en componentes de layout y UI.  
> **Riesgo:** bajo — son adiciones de atributos HTML, no cambios de lógica.

### B1 · Skip-to-content link
**Archivo:** `app/layout.tsx`

Añadir justo después del `<body>` y añadir `id` al `<main>`:
```tsx
<body ...>
  {/* Skip to content — accesibilidad teclado */}
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100]
               focus:rounded-md focus:bg-green-500 focus:px-4 focus:py-2 focus:text-sm
               focus:font-semibold focus:text-white focus:outline-none"
  >
    Saltar al contenido
  </a>
  <Header />
  <main id="main-content" className="flex-1">{children}</main>
  <Footer />
</body>
```

---

### B2 · `aria-current="page"` en navegación del header
**Archivo:** `components/layout/Header.tsx`

En el map de `NAV_ITEMS` (desktop), añadir el atributo:
```tsx
<Link
  key={item.href}
  href={item.href}
  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
  className={cn(...)}
>
```
Hacer lo mismo en el menú mobile (el segundo `map` que une `NAV_ITEMS + SECONDARY_NAV`).

---

### B3 · `aria-label` en los dos `<nav>` del header
**Archivo:** `components/layout/Header.tsx`

```tsx
{/* Nav desktop */}
<nav aria-label="Navegación principal" className="hidden lg:flex ...">

{/* Nav mobile */}
<nav aria-label="Menú móvil" className="lg:hidden border-t ...">
```

---

### B4 · `prefers-reduced-motion` en el carrusel
**Archivo:** `app/globals.css`

Añadir al final del archivo:
```css
/* Respeto a preferencias de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none;
  }
}
```

---

### B5 · `aria-hidden` en items duplicados del carrusel
**Archivo:** `components/home/TotalsBlock.tsx`

El carrusel duplica los items (`doubled = [...ITEMS, ...ITEMS]`). Los segundos 8 deben ser invisibles para lectores de pantalla:

```tsx
{doubled.map((item, idx) => (
  <div
    key={`${item.key}-${idx}`}
    aria-hidden={idx >= ITEMS.length ? true : undefined}
    className="flex items-baseline gap-2.5 px-5 py-3.5 shrink-0 border-r border-border"
  >
    ...
  </div>
))}
```

---

### B6 · `scope="col"` en `<CompareTable>`
**Archivo:** `components/ui/CompareTable.tsx`

```tsx
<thead>
  <tr className="border-b border-border bg-bg-elevated/50">
    <th scope="col" className="py-3 px-4 text-left ...">Campo</th>
    <th scope="col" className="py-3 px-4 text-center font-semibold text-green-400">{labelA}</th>
    <th scope="col" className="py-3 px-4 text-center font-semibold text-guinda-300">{labelB}</th>
  </tr>
</thead>
```

---

### B7 · `aria-label` en breadcrumbs de fichas
**Archivos:** `app/fuerzas-armadas/[slug]/page.tsx`, `app/estados/[slug]/page.tsx`, `app/equipamiento/[slug]/page.tsx`, `app/operativos/[slug]/page.tsx`

En cada breadcrumb:
```tsx
// ANTES:
<nav className="mb-6 text-sm text-text-muted">
// DESPUÉS:
<nav aria-label="Ruta de navegación" className="mb-6 text-sm text-text-muted">
```

---

### B8 · `aria-label` en el anchor "Red Centinela" del footer
**Archivo:** `components/layout/Footer.tsx`

```tsx
<a
  href="https://centinelatactico.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visitar Centinela Táctico — base de datos global de fuerzas armadas, 198 países"
  className="group flex items-center ..."
>
```

---

### B9 · `aria-hidden` en el SVG del SearchBar home
**Archivo:** `components/home/SearchBar.tsx`

El ícono de lupa dentro del input no tiene `aria-hidden`:
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16" height="16"
  aria-hidden="true"   {/* ← añadir */}
  ...
>
```

---

**✅ Verificación Fase B:**
```bash
npx tsc --noEmit && npx next lint
# commit: "fix(fase-b): accesibilidad — aria-current, skip-to-content, reduced-motion, aria-hidden carrusel, scope tabla, breadcrumbs, footer"
```

---

## Fase C — Páginas de error + tipos de TypeScript
> **Estimado:** ~45 min · Creación de 2 archivos nuevos y correcciones de tipos.  
> **Riesgo:** muy bajo.

### C1 · Crear `app/not-found.tsx`
**Archivo nuevo:** `app/not-found.tsx`

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-mono text-[11px] text-green-500 tracking-[0.22em] uppercase mb-4">
        Error 404
      </p>
      <h1 className="text-4xl font-bold text-[#e8f0ec] mb-4">
        Página no encontrada
      </h1>
      <p className="text-base text-text-muted mb-8 max-w-md mx-auto">
        La ruta que buscas no existe o fue movida. Verifica la URL
        o regresa al inicio.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-green-500/10 border border-green-500/20 px-5 py-2.5
                     text-base font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          ← Ir al inicio
        </Link>
        <Link
          href="/busqueda"
          className="rounded-sm border border-border px-5 py-2.5 text-base
                     font-medium text-text-muted hover:text-text hover:border-green-500/30 transition-colors"
        >
          Buscar
        </Link>
      </div>
    </div>
  );
}
```

---

### C2 · Crear `app/error.tsx`
**Archivo nuevo:** `app/error.tsx`

```tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-mono text-[11px] text-guinda-400 tracking-[0.22em] uppercase mb-4">
        Error inesperado
      </p>
      <h2 className="text-3xl font-bold text-[#e8f0ec] mb-4">
        Algo salió mal
      </h2>
      <p className="text-base text-text-muted mb-8">
        Ocurrió un error al cargar esta sección. Puedes intentar de nuevo
        o regresar al inicio.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-sm bg-green-500/10 border border-green-500/20 px-5 py-2.5
                     text-base font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
```

---

### C3 · Añadir `historia?` al tipo `FuerzaArmada`
**Archivo:** `types/index.ts`

Encontrar la interfaz `FuerzaArmada` y añadir el campo:
```ts
export interface FuerzaArmada {
  // ... campos existentes ...
  historia?: string | null;  // ← añadir
}
```
Esto elimina el cast inseguro `(fuerza as { historia?: string })` en la ficha.

---

### C4 · Deprecar `MapView.tsx`
**Archivo:** `components/ui/MapView.tsx`

Añadir al principio del archivo:
```tsx
/**
 * @deprecated Componente reemplazado por PresenceMap.tsx (2026-06-21).
 * MapLibre fue removido del proyecto. No importar este archivo.
 * Se mantiene temporalmente para no romper imports pendientes de limpiar.
 */
```

---

**✅ Verificación Fase C:**
```bash
npx tsc --noEmit && npx next lint
# commit: "fix(fase-c): not-found y error pages, tipo historia en FuerzaArmada, deprecar MapView"
```

---

## Fase D — SEO y Open Graph
> **Estimado:** ~1.5 horas · Requiere crear una imagen estática.  
> **Riesgo:** bajo.

### D1 · Imagen Open Graph estática
**Archivos:** `public/og-image.png` (nuevo), `app/layout.tsx`

Crear una imagen 1200×630 px con el diseño de Centinela México (fondo oscuro, logotipo, tagline). Puede ser una imagen simple exportada desde Figma, Canva o generada con código.

Añadir en `app/layout.tsx` dentro de `metadata`:
```ts
openGraph: {
  type: "website",
  locale: "es_MX",
  siteName: "Centinela México",
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Centinela México — Base de datos de fuerzas de seguridad",
    },
  ],
},
```

---

### D2 · Twitter/X Card meta
**Archivo:** `app/layout.tsx`

Añadir después del bloque `openGraph`:
```ts
twitter: {
  card: "summary_large_image",
  title: "Centinela México",
  description: "Base de datos interactiva sobre las fuerzas de seguridad y defensa de México.",
  images: ["/og-image.png"],
},
```

---

### D3 · Canonical en páginas con query params
**Archivos:** `app/comparador/page.tsx`, `app/glosario/page.tsx`, `app/actualidad/page.tsx`

Añadir en los `metadata` de cada una:
```ts
export const metadata: Metadata = {
  title: "Comparador",
  // ...
  alternates: {
    canonical: "/comparador",
  },
};
```

---

**✅ Verificación Fase D:**
```bash
npx tsc --noEmit && npx next lint
# Verificar en https://cards-dev.twitter.com/validator y https://developers.facebook.com/tools/debug/
# commit: "feat(fase-d): OG image, Twitter card, canonical en páginas con filtros"
```

---

## Fase E — UX y funcionalidad
> **Estimado:** ~2 horas · Mejoras de interacción.  
> **Riesgo:** medio — cambios en componentes client-side; probar en mobile.

### E1 · SearchBar: cerrar con `Escape` y soporte touch
**Archivo:** `components/home/SearchBar.tsx`

Añadir handler de teclado en el `<input>`:
```tsx
onKeyDown={(e) => {
  if (e.key === "Escape") {
    setFocused(false);
    inputRef.current?.blur();
  }
}}
```

Y en el `useEffect` de click-outside, añadir `touchend`:
```tsx
document.addEventListener("mousedown", handleClick);
document.addEventListener("touchend", handleClick);
return () => {
  document.removeEventListener("mousedown", handleClick);
  document.removeEventListener("touchend", handleClick);
};
```

---

### E2 · Añadir roles ARIA al combobox de búsqueda
**Archivo:** `components/home/SearchBar.tsx`

```tsx
<input
  ref={inputRef}
  role="combobox"
  aria-expanded={focused && filtered.length > 0}
  aria-haspopup="listbox"
  aria-autocomplete="list"
  aria-label="Búsqueda global"
  ...
/>

{/* Dropdown */}
{focused && filtered.length > 0 && (
  <div role="listbox" aria-label="Sugerencias de búsqueda" className="absolute z-20 ...">
    {filtered.map((s) => (
      <button role="option" aria-selected={false} ...>
        {s}
      </button>
    ))}
  </div>
)}
```

---

### E3 · Mapa: reemplazar `onMouseEnter` por comportamiento más estable
**Archivo:** `components/ui/PresenceMap.tsx`

Actualmente `onMouseEnter` cambia el panel en cada pixel. Cambiar a:
```tsx
// Mantener onMouseEnter para desktop pero con debounce, o simplemente usar onClick
onClick={() => setSel((p) => (p?.slug === slug ? null : e ?? null))}
onMouseEnter={() => {
  // Solo actualizar si no hay selección activa por click
  if (!sel) setSel(e ?? null);
}}
onMouseLeave={() => {
  // Solo limpiar si no fue seleccionado por click
  if (sel?.slug === slug) return; // mantener si se hizo click
}}
```

> **Alternativa más simple:** eliminar `onMouseEnter`/`onMouseLeave` y usar solo `onClick` + botón "Cerrar" en el panel. Más predecible en mobile.

---

### E4 · Leyenda de colores en el Comparador
**Archivo:** `app/comparador/page.tsx`

Añadir debajo del `<CompareSelector>` y antes de mostrar la tabla:
```tsx
{listo && (
  <div className="mb-4 flex flex-wrap gap-4 text-sm text-text-muted">
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-sm bg-green-500/20 border border-green-500/30" />
      {labelA} — valor mayor
    </span>
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-sm bg-guinda-500/20 border border-guinda-500/30" />
      {labelB} — valor mayor
    </span>
    <span className="text-text-muted/60">
      El resaltado indica magnitud, no una valoración cualitativa.
    </span>
  </div>
)}
```

---

### E5 · Query eficiente para contar noticias en Home
**Archivo:** `lib/queries/noticias.ts` y `app/page.tsx`

En las queries, añadir:
```ts
export async function countNoticias(): Promise<number> {
  // Si Supabase está conectado: SELECT COUNT(*)
  // Fallback seed:
  return seedData.noticias.length;
}
```

En `app/page.tsx`, reemplazar `getLatestNoticias(1000)` por `countNoticias()`.

---

**✅ Verificación Fase E:**
```bash
npx tsc --noEmit && npx next lint
# Probar en mobile (Chrome DevTools) que el mapa y searchbar funcionen bien
# commit: "fix(fase-e): searchbar escape+touch, combobox ARIA, mapa onClick, leyenda comparador, countNoticias"
```

---

## Fase F — Contenido y datos
> **Estimado:** variable (depende de investigación) · No hay cambios de código, solo datos.  
> **Riesgo:** ninguno para la app — solo seed JSON.

### F1 · Actualizar seed de noticias
**Archivo:** `seed/noticias.json`

Las 28 noticias actuales tienen fechas antiguas. Revisar y actualizar con boletines reales de SEDENA, SEMAR y Guardia Nacional del 2025-2026.

---

### F2 · Añadir `fuente_url` a entradas del Glosario
**Archivo:** `seed/glosario.json`

Al menos para los términos institucionales principales (DN-III-E, SEDENA, SEMAR, GN, CENAPRED...) añadir la URL del documento oficial donde aparece la definición. Ej:
```json
{
  "termino": "DN-III-E",
  "fuente_url": "https://www.gob.mx/sedena/documentos/plan-dn-iii-e"
}
```

---

### F3 · Reducir pendientes en fuerzas_armadas.json
**Archivo:** `seed/fuerzas_armadas.json`

De las 5 fuerzas, 4 están marcadas como `pendiente_verificacion: true`. Los datos de efectivos y presupuesto de SEDENA, SEMAR, FAM y GN son públicos (PEF, informes SEDENA, INEGI). Completar al menos los campos `efectivos_aprox` y `presupuesto_aprox` con fuente citada.

---

**✅ Verificación Fase F:**
```bash
node scripts/generate-seed-sql.mjs  # regenerar seed.sql
# No hay cambio de código — solo revisar que los JSON sean válidos
node -e "JSON.parse(require('fs').readFileSync('seed/noticias.json','utf8'))"
# commit: "data(fase-f): actualizar noticias, fuentes glosario, completar datos fuerzas"
```

---

## Fase G — Seguridad y hardening
> **Estimado:** ~30 min · Solo configuración de Vercel.  
> **Riesgo:** mínimo — solo headers HTTP, nada de lógica.

### G1 · Content Security Policy básico en Vercel
**Archivo:** `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

> **Nota:** No se añade CSP estricto todavía porque el sitio carga Google Fonts y las reglas de `next/font` necesitan ajuste de directivas. Se puede añadir en una iteración posterior.

---

### G2 · Verificar `rel="noreferrer"` en links del seed
En las fichas de fuerza y estado, el `fuente_url` del seed se renderiza como `<a>`. Confirmar que todos los links externos generados dinámicamente tengan `rel="noopener noreferrer"`. Hacer grep:
```bash
grep -r "target=\"_blank\"" app/ components/ | grep -v "noreferrer"
```
Corregir los que falten.

---

**✅ Verificación Fase G:**
```bash
npx tsc --noEmit && npx next lint
# commit: "fix(fase-g): security headers en vercel.json, verificar rel=noreferrer"
```

---

## Resumen de fases

| Fase | Tema | Estimado | Riesgo | Impacto |
|------|------|----------|--------|---------|
| **A** | Limpieza inmediata (texto, config, repo) | 30 min | 🟢 Mínimo | Alto (SEO + repo limpio) |
| **B** | Accesibilidad base (a11y) | 1.5 h | 🟢 Bajo | Alto (WCAG 2.1) |
| **C** | Páginas de error + tipos TS | 45 min | 🟢 Bajo | Medio (UX 404, tipado) |
| **D** | SEO y Open Graph | 1.5 h | 🟢 Bajo | Alto (compartir en redes) |
| **E** | UX e interacciones | 2 h | 🟡 Medio | Medio (mobile, teclado) |
| **F** | Contenido y datos del seed | Variable | 🟢 Ninguno | Alto (credibilidad) |
| **G** | Seguridad y hardening | 30 min | 🟢 Mínimo | Medio (buenas prácticas) |

**Total estimado de código:** ~7 horas de trabajo  
**Orden recomendado:** A → B → C → D → E → G → F (F es el único que no depende de código)

---

## Convención de commits por fase

```
fix(fase-a): ...  → limpieza config/texto
fix(fase-b): ...  → accesibilidad
fix(fase-c): ...  → error pages + tipos
feat(fase-d): ... → OG image / SEO
fix(fase-e): ...  → UX interacciones
data(fase-f): ... → seed data
fix(fase-g): ...  → seguridad
```
