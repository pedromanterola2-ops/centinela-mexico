import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Conoce el proyecto Centinela México: misión, metodología, fuentes oficiales y principios de verificación de datos.",
};

const FUENTES = [
  {
    nombre: "Secretaría de la Defensa Nacional (SEDENA)",
    url: "https://www.gob.mx/sedena",
  },
  {
    nombre: "Secretaría de Marina — Armada de México (SEMAR)",
    url: "https://www.gob.mx/semar",
  },
  {
    nombre: "Guardia Nacional",
    url: "https://www.gob.mx/guardianacional",
  },
  {
    nombre: "Secretaría de Seguridad y Protección Ciudadana (SSPC)",
    url: "https://www.gob.mx/sspc",
  },
  {
    nombre: "Centro Nacional de Prevención de Desastres (CENAPRED)",
    url: "https://www.cenapred.unam.mx",
  },
  {
    nombre: "Coordinación Nacional de Protección Civil (CNPC)",
    url: "https://www.gob.mx/cnpc",
  },
  {
    nombre: "Instituto Nacional de Estadística y Geografía (INEGI)",
    url: "https://www.inegi.org.mx",
  },
  {
    nombre: "Diario Oficial de la Federación (DOF)",
    url: "https://www.dof.gob.mx",
  },
  {
    nombre: "Plataforma Nacional de Transparencia (PNT)",
    url: "https://www.plataformadetransparencia.org.mx",
  },
  {
    nombre: "Gobiernos estatales y secretarías de seguridad",
    url: "https://www.gob.mx",
  },
];

const SECCIONES = [
  { href: "/fuerzas-armadas", label: "Fuerzas Armadas", desc: "SEDENA, SEMAR, Fuerza Aérea y Guardia Nacional." },
  { href: "/estados", label: "Estados", desc: "Las 32 entidades federativas y sus corporaciones de seguridad." },
  { href: "/equipamiento", label: "Equipamiento", desc: "Material terrestre, aéreo, naval e individual en servicio." },
  { href: "/operativos", label: "Operativos", desc: "Cronología de operaciones y eventos institucionales." },
  { href: "/proteccion-civil", label: "Protección Civil", desc: "Sistema Nacional de Protección Civil y registro de desastres." },
  { href: "/mapa", label: "Mapa Interactivo", desc: "Instalaciones militares, navales y de seguridad por entidad." },
];

export default function AcercaDePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-12">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          El proyecto
        </p>
        <h1 className="text-3xl font-bold text-text mb-4">Acerca de Centinela México</h1>
        <p className="text-base text-text-muted leading-relaxed max-w-2xl">
          Centinela México es una base de datos interactiva, educativa y de
          fuentes abiertas sobre las fuerzas de seguridad y defensa de México.
          Compila información pública de dependencias oficiales para facilitar
          la consulta ciudadana y el análisis comparativo entre entidades.
        </p>
      </div>

      {/* Misión */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4 pb-2 border-b border-border">
          Misión
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          Centralizar y estructurar información de fuentes oficiales y de
          acceso público sobre las fuerzas armadas, policiales y de protección
          civil de México, en un formato accesible, comparable y verificable.
          El sitio está orientado a ciudadanos, periodistas, académicos y
          cualquier persona interesada en comprender la arquitectura de
          seguridad del país.
        </p>
      </section>

      {/* Principios */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4 pb-2 border-b border-border">
          Principios
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              titulo: "Datos de fuentes oficiales",
              desc: "El núcleo de datos (fichas, cifras y registros) proviene de fuentes oficiales y de acceso público. No se usan filtraciones, datos clasificados ni rumores.",
            },
            {
              titulo: "Divulgación claramente diferenciada",
              desc: "La sección Actualidad añade medios y canales especializados (no oficiales) como material de divulgación, siempre etiquetados como tales y separados de las fuentes oficiales.",
            },
            {
              titulo: "Datos verificables o marcados",
              desc: "Si un dato carece de fuente confirmada, se marca como «Pendiente de verificación» en lugar de inventarse.",
            },
            {
              titulo: "Fin educativo e informativo",
              desc: "El sitio no hace juicios de valor ni recomendaciones operativas. Su objetivo es informar.",
            },
            {
              titulo: "Acceso libre",
              desc: "Sin registro, sin pago, sin rastreo de usuarios. Toda la información es de acceso público.",
            },
          ].map((p) => (
            <div
              key={p.titulo}
              className="rounded-lg border border-border bg-bg-surface p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <h3 className="text-sm font-semibold text-text">{p.titulo}</h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metodología */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4 pb-2 border-b border-border">
          Metodología
        </h2>
        <p className="text-sm text-text-muted leading-relaxed mb-4">
          Los datos se compilan manualmente a partir de boletines de prensa,
          portales de transparencia, el Diario Oficial de la Federación y
          estadísticas del INEGI. Cada registro incluye la URL de la fuente
          cuando está disponible.
        </p>
        <p className="text-sm text-text-muted leading-relaxed">
          Los campos sin fuente oficial confirmada se marcan explícitamente
          como <span className="font-mono text-[#8b4051] font-semibold">pendiente_verificacion</span> y
          se presentan en la interfaz como «Pendiente» con fondo guinda,
          diferenciándolos visualmente de los datos verificados.
        </p>
      </section>

      {/* Secciones del sitio */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4 pb-2 border-b border-border">
          Secciones
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECCIONES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-lg border border-border bg-bg-surface px-4 py-3.5 transition-all hover:border-green-500/30 hover:bg-bg-elevated"
            >
              <p className="text-sm font-medium text-text group-hover:text-green-400 transition-colors mb-0.5">
                {s.label}
              </p>
              <p className="text-xs text-text-muted/70">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Fuentes */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4 pb-2 border-b border-border">
          Fuentes principales
        </h2>
        <ul className="space-y-2">
          {FUENTES.map((f) => (
            <li key={f.url} className="flex items-center gap-2">
              <span className="h-px w-3 bg-border shrink-0" />
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted hover:text-green-400 transition-colors"
              >
                {f.nombre}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Stack técnico */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4 pb-2 border-b border-border">
          Stack técnico
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          Construido con <span className="text-text">Next.js</span> (App
          Router) +{" "}
          <span className="text-text">TypeScript</span> +{" "}
          <span className="text-text">Tailwind CSS</span>. Base de datos:{" "}
          <span className="text-text">Supabase</span> (PostgreSQL). Mapa:{" "}
          <span className="text-text">MapLibre GL JS</span> con tiles de
          OpenStreetMap. Despliegue en{" "}
          <span className="text-text">Vercel</span>. Sin dependencias de pago.
        </p>
      </section>

      {/* Disclaimer */}
      <div className="rounded-lg border border-[#b87340]/30 bg-[#b87340]/5 px-5 py-4">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="font-semibold text-[#b87340]">Aviso: </span>
          Información con fines exclusivamente educativos e informativos,
          compilada de fuentes oficiales y de acceso público. Centinela México
          no es una dependencia gubernamental ni tiene afiliación institucional.
          El sitio no produce ni difunde información clasificada o restringida.
        </p>
      </div>
    </div>
  );
}
