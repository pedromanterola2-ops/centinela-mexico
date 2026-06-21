import type { Metadata } from "next";
import Link from "next/link";
import { getAllFuerzasArmadas } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { tipoFuerzaLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fuerzas Armadas",
  description:
    "SEDENA, SEMAR, Fuerza Aérea Mexicana y Guardia Nacional. Estructura, misión y datos institucionales de fuentes oficiales.",
};

export default async function FuerzasArmadasPage() {
  const fuerzas = await getAllFuerzasArmadas();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Fuerzas Armadas</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Instituciones armadas y de seguridad de la Federación. Cada ficha
          compila datos de estructura, misión y dependencia desde fuentes
          oficiales de acceso público.
        </p>
      </div>

      {fuerzas.length === 0 ? (
        <p className="text-sm text-text-muted">
          No hay instituciones indexadas todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fuerzas.map((f) => (
            <Link
              key={f.slug}
              href={`/fuerzas-armadas/${f.slug}`}
              className="group rounded-lg border border-border bg-bg-surface p-5 transition-all duration-200 hover:border-green-500/40 hover:bg-bg-elevated hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 shrink-0">
                  <span className="text-xs font-bold text-green-400 font-mono">
                    {(f.siglas ?? f.nombre).slice(0, 4)}
                  </span>
                </div>
                {f.pendiente_verificacion ? (
                  <Badge variant="pendiente">En verificación</Badge>
                ) : (
                  <Badge variant="verificado">Verificada</Badge>
                )}
              </div>

              <h2 className="text-sm font-semibold text-text group-hover:text-green-400 transition-colors mb-1">
                {f.siglas ?? f.nombre}
              </h2>
              <p className="text-xs text-text-muted leading-relaxed mb-3">
                {f.nombre}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-text-muted/70 font-mono">
                <span>{tipoFuerzaLabel(f.tipo)}</span>
                {f.anio_fundacion && (
                  <>
                    <span className="text-border">·</span>
                    <span>Desde {f.anio_fundacion}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-8 text-[11px] text-text-muted/50">
        {fuerzas.length} institución(es) indexada(s). Datos de fuentes oficiales;
        los marcados &quot;En verificación&quot; aún no cuentan con fuente confirmada.
      </p>
    </div>
  );
}
