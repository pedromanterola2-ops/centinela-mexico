# Centinela México

Base de datos interactiva, educativa y de fuentes abiertas sobre las fuerzas de seguridad y defensa de México.

> **Aviso:** Información con fines educativos e informativos, compilada de fuentes oficiales y de acceso público. Las fuentes incluyen SEDENA, SEMAR, Guardia Nacional, CNPC/CENAPRED, INEGI, DOF y Plataforma Nacional de Transparencia.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS v3 |
| Base de datos | Supabase (Postgres + Storage) |
| Mapa | MapLibre GL JS + OpenStreetMap (Fase 3) |
| Deploy | Vercel (hobby tier — sin costo) |

---

## Instalación local

```bash
# 1. Clonar
git clone <repo-url>
cd centinela-mexico

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Iniciar en desarrollo
npm run dev
# → http://localhost:3000
```

---

## Variables de entorno

Crea un proyecto en [supabase.com](https://supabase.com) (free tier) y copia las claves:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

Sin estas variables el sitio funciona con datos de placeholder — útil para desarrollar la UI antes de conectar Supabase.

---

## Despliegue en Vercel

### Opción A — CLI (recomendado)

```bash
npm i -g vercel
vercel login
vercel --prod
```

Durante el deploy, Vercel solicitará las variables de entorno. Agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Opción B — GitHub + Vercel Dashboard

1. Sube el repositorio a GitHub
2. En [vercel.com/new](https://vercel.com/new) importa el repo
3. En **Environment Variables** agrega las dos variables de Supabase
4. Click **Deploy**

El build toma ~30–60 segundos en los servidores de Vercel (x86_64, glibc moderno, SWC nativo).

---

## Estructura del proyecto

```
centinela-mexico/
├── app/                          # Rutas (App Router)
│   ├── layout.tsx                # Layout global (Header + Footer)
│   ├── page.tsx                  # Home
│   ├── fuerzas-armadas/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── estados/[slug]/page.tsx
│   ├── comparador/page.tsx
│   ├── equipamiento/[slug]/page.tsx
│   ├── operativos/[slug]/page.tsx
│   ├── proteccion-civil/page.tsx
│   ├── actualidad/page.tsx
│   ├── mapa/page.tsx
│   ├── glosario/page.tsx
│   └── acerca-de/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Navegación sticky con hamburger
│   │   └── Footer.tsx            # Footer con disclaimer oficial
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── SearchBar.tsx         # Buscador global (placeholder funcional)
│   │   ├── SectionGrid.tsx       # 8 accesos a secciones
│   │   ├── TotalesBlock.tsx      # Contadores (Supabase / placeholder)
│   │   └── MiniMapContainer.tsx  # Placeholder para Fase 3
│   └── ui/
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── StatBlock.tsx
│       ├── Timeline.tsx          # Stub — Fase 2
│       ├── CompareTable.tsx      # Stub — Fase 2
│       └── MapView.tsx           # Stub — Fase 3
│
├── lib/
│   ├── supabase.ts               # Cliente lazy (no falla en build estático)
│   └── utils.ts                  # cn(), formatNumber(), toSlug()
│
├── types/
│   ├── index.ts                  # Interfaces de dominio
│   └── database.ts               # Tipos generados de Supabase
│
├── seed/                         # Datos semilla (JSON curado)
│   └── fuerzas_armadas.json      # Placeholder inicial
│
├── public/
│   └── ...
│
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── eslint.config.mjs
└── vercel.json
```

---

## Scripts

```bash
npm run dev       # Servidor de desarrollo en http://localhost:3000
npm run build     # Build de producción
npm run start     # Servidor de producción (requiere build previo)
npm run lint      # ESLint
npm run format    # Prettier
```

---

## Datos y fuentes

Todos los datos deben provenir de fuentes oficiales de acceso público:

- **SEDENA** — sedena.gob.mx
- **SEMAR** — semar.gob.mx
- **Guardia Nacional** — gob.mx/guardianacional
- **CNPC / CENAPRED** — cnpc.gob.mx / cenapred.gob.mx
- **INEGI** — inegi.org.mx
- **DOF** — dof.gob.mx
- **Plataforma Nacional de Transparencia** — plataformadetransparencia.org.mx
- **Gobiernos estatales** — sitios .gob.mx de cada entidad

Datos sin fuente verificable se marcan `pendiente_verificacion: true` en el seed JSON.

---

## Fases de desarrollo

| Fase | Estado | Descripción |
|------|--------|-------------|
| 0 | ✅ | Andamiaje: Next.js, Tailwind, Supabase, ESLint/Prettier |
| 1 | ✅ | Layout global, home, componentes base |
| 2 | ⏳ | Fichas de fuerzas armadas y estados |
| 3 | ⏳ | Mapa interactivo (MapLibre + OpenStreetMap) |
| 4 | ⏳ | Comparador, equipamiento, operativos |
| 5 | ⏳ | Protección Civil, actualidad, glosario |

---

## Licencia

Uso educativo e informativo. Ver disclaimer en footer del sitio.
