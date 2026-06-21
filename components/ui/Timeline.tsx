/**
 * Timeline — línea de tiempo vertical de operativos o eventos.
 *
 * Presentacional: la página decide el orden, el agrupado y el filtrado.
 * Cada ítem puede enlazar a su ficha y mostrar tipo, fecha y entidades.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  fecha: string;
  titulo: string;
  descripcion?: string;
  tipo?: string;
  tipoLabel?: string;
  entidades?: string[];
  href?: string;
}

interface TimelineProps {
  items?: TimelineItem[];
  className?: string;
}

/** Color del punto y la etiqueta según el tipo de operativo. */
const tipoColor: Record<string, string> = {
  seguridad: "bg-guinda-500",
  desastre: "bg-amber-500",
  humanitario: "bg-sky-500",
  ceremonial: "bg-green-500",
  mixto: "bg-purple-500",
};

export function Timeline({ items = [], className = "" }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed border-border bg-bg-surface/30 p-12 text-text-muted",
          className
        )}
      >
        <p className="text-sm">No hay operativos que coincidan con el filtro.</p>
      </div>
    );
  }

  return (
    <ol className={cn("relative border-l border-border ml-1.5", className)}>
      {items.map((item) => {
        const dot = item.tipo ? tipoColor[item.tipo] ?? "bg-green-500" : "bg-green-500";
        const Inner = (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <time className="text-xs text-text-muted font-mono">
                {item.fecha}
              </time>
              {item.tipoLabel && (
                <span className="text-[10px] uppercase tracking-wider text-text-muted/70 border border-border rounded px-1.5 py-0.5">
                  {item.tipoLabel}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-text group-hover:text-green-400 transition-colors leading-snug">
              {item.titulo}
            </h3>
            {item.descripcion && (
              <p className="mt-1 text-xs text-text-muted leading-relaxed line-clamp-2">
                {item.descripcion}
              </p>
            )}
            {item.entidades && item.entidades.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.entidades.map((ent) => (
                  <span
                    key={ent}
                    className="text-[10px] text-text-muted/80 bg-bg-elevated border border-border rounded px-1.5 py-0.5"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            )}
          </>
        );

        return (
          <li key={item.id} className="mb-7 ml-5 last:mb-0">
            <span
              className={cn(
                "absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-bg-base",
                dot
              )}
            />
            {item.href ? (
              <Link
                href={item.href}
                className="group block rounded-lg border border-transparent -mx-3 px-3 py-2 transition-colors hover:border-border hover:bg-bg-surface/60"
              >
                {Inner}
              </Link>
            ) : (
              <div className="px-0 py-2">{Inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
