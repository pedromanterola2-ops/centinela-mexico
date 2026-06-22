"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * Cartograma de cuadrícula (tile-grid) de las 32 entidades federativas.
 *
 * Decisión de diseño: en vez de marcar instalaciones con coordenadas puntuales
 * —lo que implicaría una precisión que no podemos sostener con fuentes abiertas
 * y que es sensible tratándose de seguridad— el mapa es deliberadamente
 * ABSTRACTO. Cada entidad es un mosaico cuya intensidad refleja la "presencia
 * institucional documentada" en esta base: mando territorial militar (zona /
 * región militar), instalaciones indexadas con fuente, y presencia naval.
 *
 * El color NO representa intensidad operativa real ni capacidad de fuerza:
 * sólo cuántos elementos institucionales están documentados aquí por entidad.
 */

export interface EstadoPresencia {
  slug: string;
  nombre: string;
  /** Score compuesto de elementos institucionales documentados. */
  score: number;
  /** Instalaciones indexadas en la entidad. */
  instalaciones: number;
  zonaMilitar: string | null;
  regionMilitar: string | null;
  presenciaNaval: boolean;
  pendiente: boolean;
}

/** Posición (col, fila) de cada entidad en la cuadrícula 8×6. Geografía aproximada. */
const GRID: Record<string, [number, number]> = {
  "baja-california": [0, 0],
  sonora: [1, 0],
  chihuahua: [2, 0],
  coahuila: [3, 0],
  "nuevo-leon": [4, 0],
  tamaulipas: [5, 0],
  "baja-california-sur": [0, 1],
  sinaloa: [1, 1],
  durango: [2, 1],
  zacatecas: [3, 1],
  "san-luis-potosi": [4, 1],
  nayarit: [1, 2],
  aguascalientes: [2, 2],
  guanajuato: [3, 2],
  queretaro: [4, 2],
  hidalgo: [5, 2],
  veracruz: [6, 2],
  colima: [0, 3],
  jalisco: [1, 3],
  michoacan: [2, 3],
  mexico: [3, 3],
  "ciudad-de-mexico": [4, 3],
  tlaxcala: [5, 3],
  puebla: [6, 3],
  guerrero: [2, 4],
  morelos: [3, 4],
  tabasco: [5, 4],
  campeche: [6, 4],
  oaxaca: [3, 5],
  chiapas: [4, 5],
  yucatan: [6, 5],
  "quintana-roo": [7, 5],
};

/** Abreviatura de 2–3 letras para el mosaico. */
const ABBR: Record<string, string> = {
  aguascalientes: "AGU",
  "baja-california": "BC",
  "baja-california-sur": "BCS",
  campeche: "CAM",
  chiapas: "CHP",
  chihuahua: "CHH",
  "ciudad-de-mexico": "CMX",
  coahuila: "COA",
  colima: "COL",
  durango: "DUR",
  guanajuato: "GUA",
  guerrero: "GRO",
  hidalgo: "HID",
  jalisco: "JAL",
  mexico: "MEX",
  michoacan: "MIC",
  morelos: "MOR",
  nayarit: "NAY",
  "nuevo-leon": "NL",
  oaxaca: "OAX",
  puebla: "PUE",
  queretaro: "QRO",
  "quintana-roo": "QR",
  "san-luis-potosi": "SLP",
  sinaloa: "SIN",
  sonora: "SON",
  tabasco: "TAB",
  tamaulipas: "TAM",
  tlaxcala: "TLA",
  veracruz: "VER",
  yucatan: "YUC",
  zacatecas: "ZAC",
};

const COLS = 8;
const ROWS = 6;

/** Devuelve color de relleno (verde militar) según el bucket de score. */
function fillFor(score: number): string {
  if (score >= 7) return "rgba(45,122,71,0.95)";
  if (score >= 5) return "rgba(45,122,71,0.72)";
  if (score >= 3) return "rgba(45,122,71,0.5)";
  if (score >= 2) return "rgba(45,122,71,0.3)";
  return "rgba(45,122,71,0.13)";
}

function textFor(score: number): string {
  return score >= 5 ? "#eafff1" : "#9fb6a8";
}

interface PresenceMapProps {
  estados: EstadoPresencia[];
  /** Versión reducida para el home: sin panel ni leyenda, mosaicos enlazan a la ficha. */
  compact?: boolean;
}

export function PresenceMap({ estados, compact = false }: PresenceMapProps) {
  const bySlug = useMemo(() => {
    const m = new Map<string, EstadoPresencia>();
    estados.forEach((e) => m.set(e.slug, e));
    return m;
  }, [estados]);

  const [sel, setSel] = useState<EstadoPresencia | null>(null);

  const gap = compact ? "3px" : "6px";

  const grid = (
    <div
      role="group"
      aria-label="Mapa de presencia institucional por entidad"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap,
        aspectRatio: `${COLS} / ${ROWS}`,
      }}
    >
      {Object.entries(GRID).map(([slug, [col, row]]) => {
        const e = bySlug.get(slug);
        const abbr = ABBR[slug] ?? slug.slice(0, 3).toUpperCase();
        const score = e?.score ?? 0;
        const active = sel?.slug === slug;

        const tile = (
          <span
            className="flex h-full w-full flex-col items-center justify-center rounded-[3px] transition-transform"
            style={{
              background: fillFor(score),
              border: active
                ? "1px solid #6ee7a0"
                : "1px solid rgba(255,255,255,0.06)",
              color: textFor(score),
              transform: active ? "scale(1.06)" : undefined,
            }}
          >
            <span className="font-mono font-bold leading-none"
              style={{ fontSize: compact ? "9px" : "12px" }}>
              {abbr}
            </span>
          </span>
        );

        const cellStyle = { gridColumn: col + 1, gridRow: row + 1 } as const;

        // Home compacto: el mosaico es un enlace directo a la ficha.
        if (compact) {
          return (
            <Link
              key={slug}
              href={`/estados/${slug}`}
              title={e ? `${e.nombre} — ver ficha` : slug}
              style={cellStyle}
              className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-green-400"
            >
              {tile}
            </Link>
          );
        }

        // Página completa: el mosaico selecciona y muestra el panel.
        return (
          <button
            key={slug}
            type="button"
            onClick={() => setSel((p) => (p?.slug === slug ? null : e ?? null))}
            onMouseEnter={() => setSel(e ?? null)}
            aria-label={e ? `${e.nombre}: ${score} elementos documentados` : slug}
            style={cellStyle}
            className="cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-green-400"
          >
            {tile}
          </button>
        );
      })}
    </div>
  );

  if (compact) return grid;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      {/* Cuadrícula */}
      <div className="rounded-lg border border-border bg-bg-surface p-4 sm:p-6">
        {grid}

        {/* Leyenda */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted/70">
            Menos
          </span>
          {[1, 2, 3, 5, 7].map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-5 rounded-[2px]"
                style={{ background: fillFor(s), border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </span>
          ))}
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted/70">
            Más elementos documentados
          </span>
        </div>
      </div>

      {/* Panel de detalle */}
      <aside className="rounded-lg border border-border bg-bg-surface p-5">
        {sel ? (
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-text">{sel.nombre}</h3>
              {sel.pendiente && (
                <span className="shrink-0 rounded-sm border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-400/90">
                  En verificación
                </span>
              )}
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-text-muted/70">
                  Región militar
                </dt>
                <dd className="text-text-muted">{sel.regionMilitar ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-text-muted/70">
                  Zona militar
                </dt>
                <dd className="text-text-muted">{sel.zonaMilitar ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-text-muted/70">
                  Presencia naval
                </dt>
                <dd className="text-text-muted">{sel.presenciaNaval ? "Sí (litoral)" : "No"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-text-muted/70">
                  Instalaciones indexadas
                </dt>
                <dd className="text-text-muted">{sel.instalaciones}</dd>
              </div>
            </dl>

            <Link
              href={`/estados/${sel.slug}`}
              className="mt-5 inline-block rounded-sm bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20"
            >
              Ver ficha de {sel.nombre} →
            </Link>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-text-muted">
              Pasa el cursor o toca una entidad para ver su mando territorial,
              presencia naval e instalaciones documentadas.
            </p>
            <p className="mt-3 font-mono text-[10px] text-text-muted/50">
              32 entidades · cuadrícula esquemática
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
