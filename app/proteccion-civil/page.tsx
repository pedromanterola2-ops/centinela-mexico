import type { Metadata } from "next";
import Link from "next/link";
import { getAllDesastres } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { tipoDesastreLabel, formatFecha, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Protección Civil",
  description:
    "Estructura del Sistema Nacional de Protección Civil (CNPC, CENAPRED), planes de respuesta (DN-III-E, Plan Marina) y registro de desastres históricos en México.",
};

interface PageProps {
  searchParams: Promise<{ tipo?: string }>;
}

const TIPOS = ["sismo", "huracan", "inundacion", "vulcanico", "sequia", "incendio"] as const;

const ORGANISMOS = [
  {
    siglas: "CNPC",
    nombre: "Coordinación Nacional de Protección Civil",
    descripcion:
      "Órgano de la Secretaría de Seguridad y Protección Ciudadana que coordina el Sistema Nacional de Protección Civil (SINAPROC) y articula la respuesta federal ante emergencias y desastres.",
  },
  {
    siglas: "CENAPRED",
    nombre: "Centro Nacional de Prevención de Desastres",
    descripcion:
      "Instancia técnica y científica encargada del monitoreo de fenómenos perturbadores, la investigación, el desarrollo de sistemas de alerta y la difusión de cultura de prevención.",
  },
  {
    siglas: "SE-PC",
    nombre: "Sistemas Estatales y Municipales de Protección Civil",
    descripcion:
      "Coordinaciones de protección civil en las 32 entidades y sus municipios, que operan los primeros niveles de respuesta y se articulan con el nivel federal cuando la magnitud lo requiere.",
  },
];

const PLANES = [
  {
    nombre: "Plan DN-III-E",
    dependencia: "SEDENA · Ejército y Fuerza Aérea",
    descripcion:
      "Instrumento operativo del Ejército Mexicano para auxiliar a la población civil en casos de desastre: evacuación, rescate, remoción de escombros, albergues, atención médica y distribución de ayuda.",
  },
  {
    nombre: "Plan Marina",
    dependencia: "SEMAR · Armada de México",
    descripcion:
      "Plan de la Secretaría de Marina para la protección y el auxilio a la población en zonas costeras y marítimas ante desastres, en coordinación con Protección Civil y otras dependencias.",
  },
  {
    nombre: "Planes de PC estatal y municipal",
    dependencia: "Gobiernos estatales y municipales",
    descripcion:
      "Programas y protocolos locales de prevención y respuesta que activan los sistemas estatales y municipales, primer eslabón de atención antes de escalar al ámbito federal.",
  },
];

function Chip({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        activo
          ? "border-green-500/40 bg-green-500/15 text-green-400"
          : "border-border bg-bg-surface text-text-muted hover:text-text hover:border-green-500/30"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function ProteccionCivilPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tipoActivo = TIPOS.includes(sp.tipo as (typeof TIPOS)[number])
    ? sp.tipo
    : undefined;

  const todos = await getAllDesastres();
  const desastres = tipoActivo
    ? todos.filter((d) => d.tipo === tipoActivo)
    : todos;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Protección Civil</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          El Sistema Nacional de Protección Civil (SINAPROC) articula la
          prevención y la respuesta ante desastres en México. Esta sección
          resume su estructura, los planes de auxilio de las fuerzas armadas y
          un registro de desastres históricos, con base en fuentes oficiales.
        </p>
      </div>

      {/* Estructura */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">
          Estructura institucional
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ORGANISMOS.map((o) => (
            <div
              key={o.siglas}
              className="rounded-lg border border-border bg-bg-surface p-5"
            >
              <div className="flex h-10 w-fit items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 px-2.5 mb-3">
                <span className="text-xs font-bold text-green-400 font-mono">
                  {o.siglas}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-text mb-1.5 leading-snug">
                {o.nombre}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {o.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes de respuesta */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">
          Planes de respuesta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PLANES.map((p) => (
            <div
              key={p.nombre}
              className="rounded-lg border border-border bg-bg-surface p-5 border-l-2 border-l-green-500"
            >
              <h3 className="text-sm font-semibold text-text mb-0.5">
                {p.nombre}
              </h3>
              <p className="text-[11px] text-text-muted/70 font-mono mb-2.5">
                {p.dependencia}
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Registro de desastres */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest">
            Registro de desastres históricos
          </h2>
          <span className="text-[11px] text-text-muted/60 font-mono">
            {desastres.length} de {todos.length}
          </span>
        </div>

        {/* Filtro por tipo */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
            Tipo
          </span>
          <Chip href="/proteccion-civil" activo={!tipoActivo}>
            Todos
          </Chip>
          {TIPOS.map((t) => (
            <Chip
              key={t}
              href={`/proteccion-civil?tipo=${t}`}
              activo={tipoActivo === t}
            >
              {tipoDesastreLabel(t)}
            </Chip>
          ))}
        </div>

        {desastres.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
            <p className="text-sm text-text-muted">
              No hay desastres registrados de este tipo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {desastres.map((d) => (
              <article
                key={d.slug}
                className="rounded-lg border border-border bg-bg-surface p-5"
              >
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <h3 className="text-sm font-semibold text-text">{d.nombre}</h3>
                  <Badge variant="gris">{tipoDesastreLabel(d.tipo)}</Badge>
                  {d.pendiente_verificacion && (
                    <Badge variant="pendiente">En verificación</Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted/80 font-mono mb-3">
                  {formatFecha(d.fecha)}
                  {d.magnitud && (
                    <span className="ml-3 text-text-muted/60">· {d.magnitud}</span>
                  )}
                </p>
                {d.descripcion && (
                  <p className="text-xs text-text-muted leading-relaxed mb-3 max-w-3xl">
                    {d.descripcion}
                  </p>
                )}
                {/* Cifras de impacto */}
                {(d.muertos_aprox != null || d.damnificados_aprox != null) && (
                  <div className="flex flex-wrap gap-4 mb-3">
                    {d.muertos_aprox != null && (
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                          Fallecidos aprox.
                        </p>
                        <p className="text-sm font-semibold text-guinda-400 font-mono">
                          {formatNumber(d.muertos_aprox)}
                        </p>
                      </div>
                    )}
                    {d.damnificados_aprox != null && (
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                          Damnificados aprox.
                        </p>
                        <p className="text-sm font-semibold text-amber-400 font-mono">
                          {formatNumber(d.damnificados_aprox)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  {d.respuesta_institucional && (
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                        Respuesta institucional
                      </p>
                      <span className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/5 px-2.5 py-1 text-xs text-green-400">
                        {d.respuesta_institucional}
                      </span>
                    </div>
                  )}
                  {d.estados_afectados.length > 0 && (
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                        Estados afectados
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {d.estados_afectados.map((e) => (
                          <span
                            key={e}
                            className="text-[11px] text-text-muted bg-bg-elevated border border-border rounded px-2 py-0.5"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {d.fuente_url && (
                  <a
                    href={d.fuente_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[11px] text-green-400 hover:underline font-mono"
                  >
                    Fuente: {d.fuente_url} →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 text-[11px] text-text-muted/50">
        Información de fuentes oficiales (CENAPRED, gob.mx). Los registros
        marcados &quot;En verificación&quot; aún no cuentan con cifras o detalles
        confirmados de fuente oficial.
      </p>
    </div>
  );
}
