import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllEquipamiento,
  getEquipamientoBySlug,
  getFuerzaBySlug,
} from "@/lib/queries";
import { StatBlock } from "@/components/ui/StatBlock";
import { Badge } from "@/components/ui/Badge";
import {
  categoriaEquipamientoLabel,
  operadorToFuerzaSlug,
  hostFromUrl,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renderiza una ruta estática por cada ítem del seed / Supabase. */
export async function generateStaticParams() {
  const items = await getAllEquipamiento();
  return items.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipamientoBySlug(slug);
  if (!item) return { title: "Equipo no encontrado" };

  return {
    title: item.nombre,
    description:
      item.descripcion ??
      `Ficha de ${item.nombre} en el catálogo de equipamiento de Centinela México.`,
  };
}

export default async function EquipoDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getEquipamientoBySlug(slug);

  if (!item) notFound();

  const verificada = !item.pendiente_verificacion;
  const fuenteHost = item.fuente_url ? hostFromUrl(item.fuente_url) : null;
  const fuerzaSlug = operadorToFuerzaSlug(item.operador);
  const fuerza = fuerzaSlug ? await getFuerzaBySlug(fuerzaSlug) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-text-muted">
        <Link href="/" className="hover:text-green-400 transition-colors">
          Inicio
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <Link
          href="/equipamiento"
          className="hover:text-green-400 transition-colors"
        >
          Equipamiento
        </Link>
        <span className="mx-1.5 text-border">·</span>
        <span className="text-text">{item.nombre}</span>
      </nav>

      {/* Encabezado con imagen */}
      <header className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5 pb-6 mb-6 border-b border-border">
        {/* Imagen o placeholder */}
        <div className="relative flex h-40 items-center justify-center rounded-lg border border-border bg-bg-elevated/60 overflow-hidden">
          {item.imagen_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imagen_url}
                alt={item.nombre}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Crédito de imagen */}
              {item.imagen_fuente && (
                <a
                  href={item.imagen_fuente}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-1 right-1.5 text-[9px] text-white/60 hover:text-white/90 bg-black/40 px-1 rounded z-10"
                  title="Ver fuente de imagen en Wikimedia Commons"
                >
                  {item.imagen_licencia ?? "Wikimedia Commons"} ↗
                </a>
              )}
            </>
          ) : (
            <span className="text-text-muted/25 text-5xl font-mono">
              {categoriaEquipamientoLabel(item.categoria).charAt(0)}
            </span>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h1 className="text-2xl font-bold text-text">{item.nombre}</h1>
            {verificada ? (
              <Badge variant="verificado">Ficha verificada</Badge>
            ) : (
              <Badge variant="pendiente">Datos en verificación</Badge>
            )}
            <Badge variant="gris">
              {categoriaEquipamientoLabel(item.categoria)}
            </Badge>
          </div>
          <p className="text-xs text-text-muted">
            {item.operador ?? "Operador no especificado"}
            {item.origen_pais && ` · Origen: ${item.origen_pais}`}
          </p>
          {!item.imagen_url && (
            <p className="mt-3 text-[10px] text-text-muted/50">
              Imagen no disponible: se mostrará cuando exista una de fuente con
              licencia libre.
            </p>
          )}
        </div>
      </header>

      {/* Datos clave */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
          Datos clave
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatBlock
            label="Categoría"
            value={categoriaEquipamientoLabel(item.categoria)}
            accent="none"
          />
          <StatBlock
            label="País de origen"
            value={item.origen_pais}
            pendiente={item.origen_pais === null}
            accent={item.origen_pais === null ? "guinda" : "verde"}
          />
          <StatBlock
            label="Cantidad aprox."
            value={item.cantidad_aprox}
            pendiente={item.cantidad_aprox === null}
            accent={item.cantidad_aprox === null ? "guinda" : "verde"}
            sublabel={
              item.cantidad_aprox === null ? "Por confirmar (PNT / oficial)" : undefined
            }
            fuente={item.cantidad_aprox !== null ? fuenteHost ?? undefined : undefined}
          />
          <StatBlock
            label="Año"
            value={item.anio}
            pendiente={item.anio === null}
            accent={item.anio === null ? "guinda" : "verde"}
            sublabel={item.anio !== null ? "Aproximado" : undefined}
          />
        </div>
      </section>

      {/* Descripción */}
      {item.descripcion && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Descripción
          </h2>
          <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
            {item.descripcion}
          </p>
        </section>
      )}

      {/* Operado por (relación con la fuerza) */}
      {fuerza && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Operado por
          </h2>
          <Link
            href={`/fuerzas-armadas/${fuerza.slug}`}
            className="group inline-flex items-center gap-3 rounded-lg border border-border bg-bg-surface p-4 transition-colors hover:border-green-500/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 shrink-0">
              <span className="text-[10px] font-bold text-green-400 font-mono">
                {(fuerza.siglas ?? fuerza.nombre).slice(0, 4)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-green-400 transition-colors">
                {fuerza.siglas ?? fuerza.nombre}
              </p>
              <p className="text-xs text-text-muted">Ver ficha institucional →</p>
            </div>
          </Link>
        </section>
      )}

      {/* Fuente oficial */}
      {item.fuente_url && (
        <section className="mb-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/[0.06] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-green-400 mb-0.5">
                Fuente oficial
              </p>
              <p className="text-xs text-text-muted font-mono break-all">
                {item.fuente_url}
              </p>
            </div>
            <a
              href={item.fuente_url}
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
