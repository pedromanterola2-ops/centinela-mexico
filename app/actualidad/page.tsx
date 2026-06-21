import type { Metadata } from "next";
import Link from "next/link";
import { getLatestNoticias } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { formatFecha, hostFromUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Actualidad",
  description:
    "Boletines y comunicados de fuentes oficiales (SEDENA, SEMAR, Guardia Nacional, CNPC, gob.mx). Cada nota enlaza a su fuente original.",
};

interface PageProps {
  searchParams: Promise<{ dependencia?: string; categoria?: string }>;
}

/** Directorio de salas de prensa oficiales (URLs estables). */
const FUENTES = [
  { nombre: "SEDENA · Sala de prensa", url: "https://www.gob.mx/sedena/prensa" },
  { nombre: "SEMAR · Sala de prensa", url: "https://www.gob.mx/semar/prensa" },
  { nombre: "Guardia Nacional", url: "https://www.gob.mx/guardianacional/prensa" },
  { nombre: "SSPC / CNPC", url: "https://www.gob.mx/sspc/prensa" },
  { nombre: "Diario Oficial de la Federación", url: "https://www.dof.gob.mx/" },
  { nombre: "gob.mx · Prensa", url: "https://www.gob.mx/busqueda" },
];

function filtroHref(params: { dependencia?: string; categoria?: string }) {
  const sp = new URLSearchParams();
  if (params.dependencia) sp.set("dependencia", params.dependencia);
  if (params.categoria) sp.set("categoria", params.categoria);
  const qs = sp.toString();
  return qs ? `/actualidad?${qs}` : "/actualidad";
}

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

export default async function ActualidadPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const depActiva = sp.dependencia;
  const catActiva = sp.categoria;

  const todas = await getLatestNoticias(100);

  const dependencias = [...new Set(todas.map((n) => n.dependencia).filter(Boolean))] as string[];
  const categorias = [...new Set(todas.map((n) => n.categoria).filter(Boolean))] as string[];

  const noticias = todas.filter(
    (n) =>
      (!depActiva || n.dependencia === depActiva) &&
      (!catActiva || n.categoria === catActiva)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Actualidad</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Boletines y comunicados publicados por fuentes oficiales. Cada nota
          enlaza directamente a su fuente original. Este listado se alimenta de
          forma curada; está diseñado para automatizarse con un ingestor de
          boletines y RSS oficiales.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
            Dependencia
          </span>
          <Chip href={filtroHref({ categoria: catActiva })} activo={!depActiva}>
            Todas
          </Chip>
          {dependencias.map((d) => (
            <Chip
              key={d}
              href={filtroHref({ dependencia: d, categoria: catActiva })}
              activo={depActiva === d}
            >
              {d}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
            Categoría
          </span>
          <Chip href={filtroHref({ dependencia: depActiva })} activo={!catActiva}>
            Todas
          </Chip>
          {categorias.map((c) => (
            <Chip
              key={c}
              href={filtroHref({ dependencia: depActiva, categoria: c })}
              activo={catActiva === c}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* Listado de notas */}
      {noticias.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-sm text-text-muted">
            No hay notas que coincidan con el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {noticias.map((n) => (
            <article
              key={n.id}
              className="group rounded-lg border border-border bg-bg-surface p-5 transition-colors hover:border-green-500/40"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {n.dependencia && <Badge variant="verde">{n.dependencia}</Badge>}
                {n.categoria && <Badge variant="gris">{n.categoria}</Badge>}
                <span className="text-[11px] text-text-muted/70 font-mono ml-auto">
                  {formatFecha(n.fecha)}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-text mb-1.5 leading-snug">
                {n.url ? (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group-hover:text-green-400 transition-colors"
                  >
                    {n.titulo}
                  </a>
                ) : (
                  n.titulo
                )}
              </h2>
              {n.resumen && (
                <p className="text-xs text-text-muted leading-relaxed mb-3 max-w-3xl">
                  {n.resumen}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                {n.fuente_oficial && (
                  <span className="text-text-muted/70">{n.fuente_oficial}</span>
                )}
                {n.url && (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline font-mono"
                  >
                    {hostFromUrl(n.url)} →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Directorio de fuentes oficiales */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">
          Directorio de fuentes oficiales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FUENTES.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border bg-bg-surface p-4 transition-colors hover:border-green-500/40"
            >
              <p className="text-sm font-medium text-text group-hover:text-green-400 transition-colors mb-0.5">
                {f.nombre}
              </p>
              <p className="text-[11px] text-text-muted/70 font-mono break-all">
                {hostFromUrl(f.url)} →
              </p>
            </a>
          ))}
        </div>
      </section>

      <p className="mt-10 text-[11px] text-text-muted/50">
        {noticias.length} de {todas.length} nota(s). Solo se incluyen
        publicaciones de fuentes oficiales; cada nota enlaza a su fuente para su
        verificación directa.
      </p>
    </div>
  );
}
