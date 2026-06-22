import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllOperativos, getOperativoBySlug } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { tipoOperativoLabel, formatFecha } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renderiza una ruta estática por cada operativo del seed / Supabase. */
export async function generateStaticParams() {
  const operativos = await getAllOperativos();
  return operativos.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const op = await getOperativoBySlug(slug);
  if (!op) return { title: "Operativo no encontrado" };

  return {
    title: op.nombre,
    description:
      op.descripcion ??
      `Ficha del operativo ${op.nombre} en la cronología de Centinela México.`,
  };
}

export default async function OperativoDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const op = await getOperativoBySlug(slug);

  if (!op) notFound();

  const verificada = !op.pendiente_verificacion;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-text-muted">
        <Link href="/" className="hover:text-green-400 transition-colors">
          Inicio
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <Link href="/operativos" className="hover:text-green-400 transition-colors">
          Operativos
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <span className="text-text">{op.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="pb-6 mb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <h1 className="text-2xl font-bold text-text">{op.nombre}</h1>
          {verificada ? (
            <Badge variant="verificado">Ficha verificada</Badge>
          ) : (
            <Badge variant="pendiente">Datos en verificación</Badge>
          )}
          <Badge variant="gris">{tipoOperativoLabel(op.tipo)}</Badge>
        </div>
        <p className="text-xs text-text-muted">
          {formatFecha(op.fecha_inicio)}
          {op.fecha_fin && ` — ${formatFecha(op.fecha_fin)}`}
        </p>
      </header>

      {/* Datos clave */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-bg-surface p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            Inicio
          </p>
          <p className="text-sm text-text">{formatFecha(op.fecha_inicio)}</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-surface p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            Fin
          </p>
          <p className="text-sm text-text">
            {op.fecha_fin ? (
              formatFecha(op.fecha_fin)
            ) : (
              <span className="text-text-muted">No especificado</span>
            )}
          </p>
        </div>
      </section>

      {/* Entidades involucradas */}
      {op.entidades_involucradas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Entidades involucradas
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {op.entidades_involucradas.map((ent) => (
              <span
                key={ent}
                className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/5 px-2.5 py-1 text-xs text-green-400"
              >
                {ent}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Descripción */}
      {op.descripcion && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Descripción
          </h2>
          <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
            {op.descripcion}
          </p>
        </section>
      )}

      {/* Resultado */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
          Resultado
        </h2>
        {op.resultado ? (
          <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
            {op.resultado}
          </p>
        ) : (
          <div className="rounded-lg border-l-2 border-l-guinda-500 border border-border bg-bg-surface p-4">
            <p className="text-sm text-text-muted">
              Pendiente de verificación con fuente oficial.
            </p>
          </div>
        )}
      </section>

      {/* Fuente oficial */}
      {op.fuente_url && (
        <section className="mb-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/[0.06] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-green-400 mb-0.5">
                Fuente oficial
              </p>
              <p className="text-xs text-text-muted font-mono break-all">
                {op.fuente_url}
              </p>
            </div>
            <a
              href={op.fuente_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-green-500/30 text-green-400 px-3.5 py-2 text-xs font-medium hover:bg-green-500/10 transition-colors"
            >
              Visitar fuente →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
