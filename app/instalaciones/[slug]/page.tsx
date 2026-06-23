import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllInstalaciones, getInstalacionById } from "@/lib/queries";
import { StatBlock } from "@/components/ui/StatBlock";
import { Badge } from "@/components/ui/Badge";
import { categoriaInstalacionLabel, hostFromUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Icono por categoría */
function iconoCategoria(cat: string): string {
  const map: Record<string, string> = {
    academia: "🎓",
    base_militar: "🏕️",
    aeropuerto_militar: "✈️",
    zona_naval: "⚓",
    astillero: "🚢",
    c4_c5: "📡",
    coordinacion_gn: "🛡️",
    proteccion_civil: "🚨",
    industria_militar: "🏭",
  };
  return map[cat] ?? "🏢";
}

export async function generateStaticParams() {
  const items = await getAllInstalaciones();
  return items.map((i) => ({ slug: i.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const inst = await getInstalacionById(slug);
  if (!inst) return { title: "Instalación no encontrada" };

  return {
    title: inst.nombre,
    description:
      inst.descripcion ??
      `Ficha de ${inst.nombre} (${categoriaInstalacionLabel(inst.categoria)}) en Centinela México.`,
  };
}

export default async function InstalacionDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const inst = await getInstalacionById(slug);

  if (!inst) notFound();

  const verificada = !inst.pendiente_verificacion;
  const fuenteHost = inst.fuente_url ? hostFromUrl(inst.fuente_url) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-green-400 transition-colors">
          Inicio
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <Link href="/instalaciones" className="hover:text-green-400 transition-colors">
          Instalaciones
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <span className="text-text">{inst.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="flex items-start gap-4 pb-6 mb-6 border-b border-border">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-green-500/40 bg-green-500/10 shrink-0 text-2xl">
          {iconoCategoria(inst.categoria)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-text leading-tight">
              {inst.nombre}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gris">{categoriaInstalacionLabel(inst.categoria)}</Badge>
            {verificada ? (
              <Badge variant="verificado">Verificada</Badge>
            ) : (
              <Badge variant="pendiente">En verificación</Badge>
            )}
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {inst.dependencia && (
          <StatBlock
            label="Dependencia"
            value={inst.dependencia}
            pendiente={false}
          />
        )}
        {inst.estado && (
          <StatBlock
            label="Estado"
            value={inst.estado}
            pendiente={false}
          />
        )}
        {inst.lat && inst.lng && (
          <StatBlock
            label="Coordenadas (aprox.)"
            value={`${inst.lat.toFixed(2)}, ${inst.lng.toFixed(2)}`}
            pendiente={false}
          />
        )}
      </div>

      {/* Descripción */}
      {inst.descripcion && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-3">
            Descripción
          </h2>
          <p className="text-base text-text-muted leading-relaxed max-w-3xl">
            {inst.descripcion}
          </p>
        </section>
      )}

      {/* Coordenadas y enlace al mapa */}
      {inst.lat && inst.lng && (
        <section className="mb-8 rounded-lg border border-border bg-bg-surface p-5">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-3">
            Ubicación aproximada
          </h2>
          <p className="text-sm text-text-muted mb-4">
            Las coordenadas son aproximadas y de dominio público. No se
            incluyen ubicaciones precisas de instalaciones operativas sensibles.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-text bg-bg-elevated border border-border rounded px-3 py-1.5">
              {inst.lat.toFixed(4)}° N, {inst.lng.toFixed(4)}° O
            </span>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-1.5 text-sm text-green-400 hover:underline"
            >
              Ver en mapa interactivo →
            </Link>
          </div>
        </section>
      )}

      {/* Fuente */}
      {inst.fuente_url && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-3">
            Fuente oficial
          </h2>
          <a
            href={inst.fuente_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:underline font-mono"
          >
            {fuenteHost ?? inst.fuente_url} ↗
          </a>
        </section>
      )}

      {/* Aviso de datos */}
      {!verificada && (
        <div className="mb-8 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-400/80">
            <strong className="text-amber-400">En verificación:</strong> algunos
            datos de esta ficha aún no cuentan con confirmación de fuente oficial.
          </p>
        </div>
      )}

      {/* Navegación */}
      <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
        <Link
          href="/instalaciones"
          className="text-sm text-text-muted hover:text-green-400 transition-colors"
        >
          ← Volver al catálogo
        </Link>
        <Link
          href="/mapa"
          className="text-sm text-text-muted hover:text-green-400 transition-colors"
        >
          Ver mapa interactivo →
        </Link>
      </div>

      <p className="mt-8 text-[13px] text-text-muted/50">
        Información con fines educativos e informativos, compilada de fuentes
        oficiales y de acceso público.
      </p>
    </div>
  );
}
