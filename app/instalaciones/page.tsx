import type { Metadata } from "next";
import Link from "next/link";
import { getAllInstalaciones } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { categoriaInstalacionLabel } from "@/lib/utils";
import type { Instalacion } from "@/types";

export const metadata: Metadata = {
  title: "Instalaciones",
  description:
    "Catálogo de instalaciones militares, navales y de seguridad en México: academias, bases, zonas navales, aeropuertos militares y centros C4/C5. Fuentes oficiales y de acceso público.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; dependencia?: string }>;
}

const CATEGORIAS = [
  "academia",
  "base_militar",
  "aeropuerto_militar",
  "zona_naval",
  "astillero",
  "c4_c5",
  "coordinacion_gn",
  "proteccion_civil",
  "industria_militar",
] as const;

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
      className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
        activo
          ? "border-green-500/40 bg-green-500/15 text-green-400"
          : "border-border bg-bg-surface text-text-muted hover:text-text hover:border-green-500/30"
      }`}
    >
      {children}
    </Link>
  );
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

function InstalacionCard({ inst }: { inst: Instalacion }) {
  return (
    <Link
      href={`/instalaciones/${inst.id}`}
      className="group flex flex-col rounded-lg border border-border bg-bg-surface overflow-hidden transition-all duration-200 hover:border-green-500/40 hover:-translate-y-0.5"
    >
      {/* Banner de color por dependencia */}
      <div className="relative flex h-24 items-center justify-center bg-bg-elevated/60 border-b border-border">
        <span className="text-4xl" role="img" aria-label={categoriaInstalacionLabel(inst.categoria)}>
          {iconoCategoria(inst.categoria)}
        </span>
        <span className="absolute top-2 left-2">
          <Badge variant="gris">{categoriaInstalacionLabel(inst.categoria)}</Badge>
        </span>
        {inst.pendiente_verificacion && (
          <span className="absolute top-2 right-2">
            <Badge variant="pendiente">Pendiente</Badge>
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-text group-hover:text-green-400 transition-colors leading-snug mb-1">
          {inst.nombre}
        </h3>
        {inst.dependencia && (
          <p className="text-xs text-text-muted mb-auto">{inst.dependencia}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-text-muted/60 font-mono">
          {inst.estado && <span>{inst.estado}</span>}
          {inst.lat && inst.lng && (
            <>
              <span className="text-border">·</span>
              <span className="text-green-500/60">📍</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function filtroHref(params: { categoria?: string; dependencia?: string }) {
  const sp = new URLSearchParams();
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.dependencia) sp.set("dependencia", params.dependencia);
  const qs = sp.toString();
  return qs ? `/instalaciones?${qs}` : "/instalaciones";
}

export default async function InstalacionesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const catActiva = CATEGORIAS.includes(
    sp.categoria as (typeof CATEGORIAS)[number]
  )
    ? sp.categoria
    : undefined;
  const depActiva = sp.dependencia;

  const todas = await getAllInstalaciones();

  // Dependencias únicas disponibles
  const dependencias = [
    ...new Set(todas.map((i) => i.dependencia).filter(Boolean)),
  ] as string[];

  // Filtrado
  const items = todas.filter(
    (i) =>
      (!catActiva || i.categoria === catActiva) &&
      (!depActiva || i.dependencia === depActiva)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-2">
            Sección
          </p>
          <h1 className="text-3xl font-bold text-text mb-3">Instalaciones</h1>
          <p className="text-base text-text-muted max-w-2xl leading-relaxed">
            Academias militares, bases, zonas navales, aeropuertos militares y
            centros de coordinación indexados con fuente oficial. Coordenadas
            aproximadas de dominio público; no se incluyen ubicaciones precisas
            de instalaciones operativas sensibles.
          </p>
        </div>
        <Link
          href="/mapa"
          className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          <span>Ver en mapa</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted uppercase tracking-widest mr-1">
            Categoría
          </span>
          <Chip href={filtroHref({ dependencia: depActiva })} activo={!catActiva}>
            Todas
          </Chip>
          {CATEGORIAS.filter((c) => todas.some((i) => i.categoria === c)).map(
            (c) => (
              <Chip
                key={c}
                href={filtroHref({ categoria: c, dependencia: depActiva })}
                activo={catActiva === c}
              >
                {iconoCategoria(c)} {categoriaInstalacionLabel(c)}
              </Chip>
            )
          )}
        </div>

        {dependencias.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-muted uppercase tracking-widest mr-1">
              Dependencia
            </span>
            <Chip href={filtroHref({ categoria: catActiva })} activo={!depActiva}>
              Todas
            </Chip>
            {dependencias.map((dep) => (
              <Chip
                key={dep}
                href={filtroHref({ categoria: catActiva, dependencia: dep })}
                activo={depActiva === dep}
              >
                {dep}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Resultados */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-base text-text-muted">
            No hay instalaciones que coincidan con el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((inst) => (
            <InstalacionCard key={inst.id} inst={inst} />
          ))}
        </div>
      )}

      <p className="mt-8 text-[13px] text-text-muted/50">
        {items.length} de {todas.length} instalación(es) indexada(s). Datos de
        fuentes oficiales de acceso público. Los registros marcados como
        &quot;Pendiente&quot; aún no cuentan con verificación completa.
      </p>
    </div>
  );
}
