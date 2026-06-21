import Link from "next/link";

export function MiniMapContainer() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest">
          Mapa de presencia
        </h2>
        <Link
          href="/mapa"
          className="text-xs text-green-400 hover:text-green-300 transition-colors"
        >
          Ver mapa completo →
        </Link>
      </div>

      {/* Placeholder del mapa — se sustituirá con MapLibre GL en Fase 3 */}
      <div className="relative rounded-lg border border-border bg-bg-surface overflow-hidden h-64 sm:h-80">
        {/* Grid de fondo */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* Silueta de México simplificada en SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20"
              style={{ background: "rgba(45,122,71,0.08)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500/60"
              >
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg>
            </div>
            <p className="text-sm text-text-muted">Mapa interactivo</p>
            <p className="text-xs text-text-muted/60 mt-1">
              MapLibre GL + OpenStreetMap — Fase 3
            </p>
            <Link
              href="/mapa"
              className="mt-4 inline-block rounded-md bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 text-xs font-medium hover:bg-green-500/20 transition-colors"
            >
              Ir al mapa →
            </Link>
          </div>
        </div>

        {/* Etiquetas decorativas de entidades */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {["Sonora", "Chihuahua", "Baja California", "Jalisco", "CDMX"].map(
            (estado) => (
              <span
                key={estado}
                className="inline-flex items-center gap-1.5 text-[10px] text-text-muted/50 font-mono"
              >
                <span className="h-1 w-1 rounded-full bg-green-500/40" />
                {estado}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
