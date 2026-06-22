import type { Metadata } from "next";
import { getPresenciaPorEntidad } from "@/lib/presencia";
import { PresenceMap } from "@/components/ui/PresenceMap";

export const metadata: Metadata = {
  title: "Mapa de presencia",
  description:
    "Mapa esquemático de la presencia institucional de seguridad y defensa por entidad federativa en México. Cuadrícula abstracta por estado; sin ubicaciones precisas. Datos de fuentes oficiales y de acceso público.",
};

export default async function MapaPage() {
  const estados = await getPresenciaPorEntidad();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección · Diferenciador
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Mapa de presencia</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Cómo se distribuye la presencia institucional de las fuerzas de
          seguridad y defensa por entidad. Cada mosaico es un estado; su
          intensidad refleja los elementos institucionales documentados en esta
          base — mando territorial militar, presencia naval e instalaciones
          indexadas. Cuadrícula esquemática: no representa fronteras, superficie
          ni ubicaciones reales.
        </p>
      </div>

      <PresenceMap estados={estados} />

      <p className="mt-5 text-[11px] text-text-muted/60 leading-relaxed max-w-3xl">
        Aviso: este mapa es <strong>esquemático y abstracto</strong>. La posición
        de los mosaicos es aproximada y no corresponde a fronteras, superficie ni
        ubicaciones reales. El color refleja únicamente cuántos elementos
        institucionales están documentados en esta base por entidad —no
        intensidad operativa, capacidad de fuerza ni localizaciones precisas.
        Información con fines educativos e informativos, compilada de fuentes
        oficiales y de acceso público.
      </p>
    </div>
  );
}
