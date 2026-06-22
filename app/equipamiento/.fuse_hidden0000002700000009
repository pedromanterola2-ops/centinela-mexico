import type { Metadata } from "next";
import Link from "next/link";
import { getAllEquipamiento } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { categoriaEquipamientoLabel } from "@/lib/utils";
import type { Equipamiento } from "@/types";

export const metadata: Metadata = {
  title: "Equipamiento",
  description:
    "Catálogo de equipamiento de las fuerzas armadas de México: material terrestre, aéreo, naval e individual, con origen y operador. Fuentes oficiales.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; operador?: string }>;
}

const CATEGORIAS = ["terrestre", "aereo", "naval", "individual"] as const;

/** Construye un href de filtro conservando/limpiando params. */
function filtroHref(params: { categoria?: string; operador?: string }) {
  const sp = new URLSearchParams();
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.operador) sp.set("operador", params.operador);
  const qs = sp.toString();
  return qs ? `/equipamiento?${qs}` : "/equipamiento";
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

function EquipoCard({ e }: { e: Equipamiento }) {
  return (
    <Link
      href={`/equipamiento/${e.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-bg-surface overflow-hidden transition-all duration-200 hover:border-green-500/40 hover:-translate-y-0.5"
    >
      {/* Placeholder de imagen (sin imágenes inventadas) */}
      <div className="relative flex h-32 items-center justify-center bg-bg-elevated/60 border-b border-border">
        <span className="text-text-muted/30 text-3xl font-mono">
          {categoriaEquipamientoLabel(e.categoria).charAt(0)}
        </span>
        <span className="absolute top-2 left-2">
          <Badge variant="gris">{categoriaEquipamientoLabel(e.categoria)}</Badge>
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-text group-hover:text-green-400 transition-colors leading-snug">
            {e.nombre}
          </h3>
        </div>
        {e.operador && (
          <p className="text-xs text-text-muted mb-3">{e.operador}</p>
        )}
        <div className="mt-auto flex items-center gap-2 text-[10px] text-text-muted/70 font-mono">
          {e.origen_pais && <span>{e.origen_pais}</span>}
          {e.anio != null && (
            <>
              <span className="text-border">·</span>
              <span>{e.anio}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function EquipamientoPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const catActiva = CATEGORIAS.includes(
    sp.categoria as (typeof CATEGORIAS)[number]
  )
    ? sp.categoria
    : undefined;
  const opActivo = sp.operador;

  const todo = await getAllEquipamiento();

  // Operadores disponibles (derivados de los datos)
  const operadores = [...new Set(todo.map((e) => e.operador).filter(Boolean))] as string[];

  // Filtrado en memoria
  const items = todo.filter(
    (e) =>
      (!catActiva || e.categoria === catActiva) &&
      (!opActivo || e.operador === opActivo)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Equipamiento</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Catálogo de material en servicio de las fuerzas armadas mexicanas,
          clasificado por categoría y operador. Compilado de fuentes oficiales
          de acceso público; las cantidades aún no confirmadas se omiten.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
            Categoría
          </span>
          <Chip href={filtroHref({ operador: opActivo })} activo={!catActiva}>
            Todas
          </Chip>
          {CATEGORIAS.map((c) => (
            <Chip
              key={c}
              href={filtroHref({ categoria: c, operador: opActivo })}
              activo={catActiva === c}
            >
              {categoriaEquipamientoLabel(c)}
            </Chip>
          ))}
        </div>

        {operadores.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
              Operador
            </span>
            <Chip href={filtroHref({ categoria: catActiva })} activo={!opActivo}>
              Todos
            </Chip>
            {operadores.map((op) => (
              <Chip
                key={op}
                href={filtroHref({ categoria: catActiva, operador: op })}
                activo={opActivo === op}
              >
                {op}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Resultados */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-sm text-text-muted">
            No hay equipamiento que coincida con el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((e) => (
            <EquipoCard key={e.slug} e={e} />
          ))}
        </div>
      )}

      <p className="mt-8 text-[11px] text-text-muted/50">
        {items.length} de {todo.length} ítem(s) indexado(s). Datos de fuentes
        oficiales; cantidades y años marcados como aproximados o pendientes de
        verificación.
      </p>
    </div>
  );
}
