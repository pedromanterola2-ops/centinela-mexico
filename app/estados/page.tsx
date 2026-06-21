import type { Metadata } from "next";
import Link from "next/link";
import { getAllEstados } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import type { Estado } from "@/types";

export const metadata: Metadata = {
  title: "Estados",
  description:
    "Las 32 entidades federativas de México: corporación estatal, secretaría de seguridad, población y datos institucionales de fuentes oficiales.",
};

// Orden de presentación de las regiones
const ORDEN_REGIONES = [
  "Noroeste",
  "Noreste",
  "Occidente",
  "Centro",
  "Sur",
  "Sureste",
];

/** Agrupa los estados por región respetando ORDEN_REGIONES. */
function agruparPorRegion(estados: Estado[]): [string, Estado[]][] {
  const mapa = new Map<string, Estado[]>();
  for (const e of estados) {
    const region = e.region ?? "Sin región";
    if (!mapa.has(region)) mapa.set(region, []);
    mapa.get(region)!.push(e);
  }
  return [...mapa.entries()].sort(
    (a, b) => ORDEN_REGIONES.indexOf(a[0]) - ORDEN_REGIONES.indexOf(b[0])
  );
}

function EstadoCard({ e }: { e: Estado }) {
  return (
    <Link
      href={`/estados/${e.slug}`}
      className="group rounded-lg border border-border bg-bg-surface p-5 transition-all duration-200 hover:border-green-500/40 hover:bg-bg-elevated hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 shrink-0">
          <span className="text-xs font-bold text-green-400 font-mono uppercase">
            {e.nombre.replace(/^(Estado de |Heroica )/, "").slice(0, 3)}
          </span>
        </div>
        {e.pendiente_verificacion ? (
          <Badge variant="pendiente">En verificación</Badge>
        ) : (
          <Badge variant="verificado">Verificada</Badge>
        )}
      </div>

      <h3 className="text-sm font-semibold text-text group-hover:text-green-400 transition-colors mb-1">
        {e.nombre}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed mb-3">
        {e.corporacion_estatal ?? "Corporación por confirmar"}
      </p>

      <div className="flex items-center gap-2 text-[10px] text-text-muted/70 font-mono">
        {e.capital && <span>{e.capital}</span>}
        {e.poblacion != null && (
          <>
            <span className="text-border">·</span>
            <span>{formatNumber(e.poblacion)} hab.</span>
          </>
        )}
      </div>
    </Link>
  );
}

export default async function EstadosPage() {
  const estados = await getAllEstados();
  const grupos = agruparPorRegion(estados);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Estados</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Las 32 entidades federativas y sus fuerzas estatales de seguridad.
          Cada ficha compila corporación, secretaría, población y descripción a
          partir de fuentes oficiales de acceso público.
        </p>
      </div>

      {estados.length === 0 ? (
        <p className="text-sm text-text-muted">
          No hay entidades indexadas todavía.
        </p>
      ) : (
        <div className="space-y-10">
          {grupos.map(([region, lista]) => (
            <section key={region}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest">
                  {region}
                </h2>
                <span className="text-[10px] text-text-muted/60 font-mono">
                  {lista.length} entidad(es)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lista.map((e) => (
                  <EstadoCard key={e.slug} e={e} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-10 text-[11px] text-text-muted/50">
        {estados.length} entidad(es) indexada(s). Población según el Censo de
        Población y Vivienda 2020 (INEGI). Los datos marcados &quot;En
        verificación&quot; aún no cuentan con fuente oficial confirmada para sus
        cifras de seguridad.
      </p>
    </div>
  );
}
