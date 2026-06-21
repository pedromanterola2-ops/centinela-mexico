import type { Metadata } from "next";
import Link from "next/link";
import { getAllOperativos } from "@/lib/queries";
import { Timeline, type TimelineItem } from "@/components/ui/Timeline";
import { tipoOperativoLabel, formatFecha, decadaDe } from "@/lib/utils";
import type { Operativo } from "@/types";

export const metadata: Metadata = {
  title: "Operativos",
  description:
    "Cronología interactiva de operativos de seguridad y despliegues de auxilio (Plan DN-III-E, Plan Marina) de las fuerzas armadas de México. Fuentes oficiales.",
};

interface PageProps {
  searchParams: Promise<{ tipo?: string; decada?: string }>;
}

const TIPOS = ["seguridad", "desastre", "humanitario", "ceremonial"] as const;

function filtroHref(params: { tipo?: string; decada?: string }) {
  const sp = new URLSearchParams();
  if (params.tipo) sp.set("tipo", params.tipo);
  if (params.decada) sp.set("decada", params.decada);
  const qs = sp.toString();
  return qs ? `/operativos?${qs}` : "/operativos";
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

/** Año (o "Sin fecha") usado como encabezado de grupo. */
function anioDe(o: Operativo): string {
  return o.fecha_inicio ? o.fecha_inicio.slice(0, 4) : "Sin fecha";
}

export default async function OperativosPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tipoActivo = TIPOS.includes(sp.tipo as (typeof TIPOS)[number])
    ? sp.tipo
    : undefined;

  const todos = await getAllOperativos();

  // Décadas disponibles (de mayor a menor)
  const decadas = [...new Set(todos.map((o) => decadaDe(o.fecha_inicio)).filter(Boolean))]
    .sort()
    .reverse() as string[];
  const decadaActiva = decadas.includes(sp.decada ?? "") ? sp.decada : undefined;

  // Filtrado
  const items = todos.filter(
    (o) =>
      (!tipoActivo || o.tipo === tipoActivo) &&
      (!decadaActiva || decadaDe(o.fecha_inicio) === decadaActiva)
  );

  // Agrupar por año (ya vienen ordenados por fecha desc desde el seed/query)
  const grupos = new Map<string, Operativo[]>();
  for (const o of items) {
    const k = anioDe(o);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k)!.push(o);
  }

  function toTimelineItems(lista: Operativo[]): TimelineItem[] {
    return lista.map((o) => ({
      id: o.slug,
      fecha: formatFecha(o.fecha_inicio),
      titulo: o.nombre,
      descripcion: o.descripcion ?? undefined,
      tipo: o.tipo ?? undefined,
      tipoLabel: tipoOperativoLabel(o.tipo),
      entidades: o.entidades_involucradas,
      href: `/operativos/${o.slug}`,
    }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Operativos</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Cronología de operativos de seguridad y despliegues de auxilio de las
          fuerzas armadas, incluyendo activaciones del Plan DN-III-E y del Plan
          Marina. Compilado de fuentes oficiales de acceso público.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
            Tipo
          </span>
          <Chip href={filtroHref({ decada: decadaActiva })} activo={!tipoActivo}>
            Todos
          </Chip>
          {TIPOS.map((t) => (
            <Chip
              key={t}
              href={filtroHref({ tipo: t, decada: decadaActiva })}
              activo={tipoActivo === t}
            >
              {tipoOperativoLabel(t)}
            </Chip>
          ))}
        </div>

        {decadas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-text-muted uppercase tracking-widest mr-1">
              Década
            </span>
            <Chip href={filtroHref({ tipo: tipoActivo })} activo={!decadaActiva}>
              Todas
            </Chip>
            {decadas.map((d) => (
              <Chip
                key={d}
                href={filtroHref({ tipo: tipoActivo, decada: d })}
                activo={decadaActiva === d}
              >
                {d}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Cronología agrupada por año */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-center">
          <p className="text-sm text-text-muted">
            No hay operativos que coincidan con el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...grupos.entries()].map(([anio, lista]) => (
            <section key={anio}>
              <h2 className="text-lg font-bold text-green-400 font-mono mb-3">
                {anio}
              </h2>
              <Timeline items={toTimelineItems(lista)} />
            </section>
          ))}
        </div>
      )}

      <p className="mt-10 text-[11px] text-text-muted/50">
        {items.length} de {todos.length} operativo(s) indexado(s). Datos de
        fuentes oficiales; resultados y cifras sin confirmar se marcan como
        pendientes.
      </p>
    </div>
  );
}
