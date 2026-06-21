import Link from "next/link";
import { getPresenciaPorEntidad } from "@/lib/presencia";
import { PresenceMap } from "@/components/ui/PresenceMap";

export async function MiniMapContainer() {
  const estados = await getPresenciaPorEntidad();

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

      <div className="rounded-lg border border-border bg-bg-surface p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_220px] sm:items-center">
          {/* Cartograma compacto: cada mosaico es una entidad y enlaza a su ficha */}
          <PresenceMap estados={estados} compact />

          <div>
            <p className="text-sm text-text-muted leading-relaxed">
              Presencia institucional documentada por entidad. La intensidad de
              cada mosaico refleja el mando territorial militar, la presencia
              naval y las instalaciones indexadas.
            </p>
            <p className="mt-3 font-mono text-[10px] text-text-muted/50 leading-relaxed">
              Cuadrícula esquemática · no representa ubicaciones reales
            </p>
            <Link
              href="/mapa"
              className="mt-4 inline-block rounded-md bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 text-xs font-medium hover:bg-green-500/20 transition-colors"
            >
              Ir al mapa →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
