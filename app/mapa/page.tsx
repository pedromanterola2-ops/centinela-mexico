import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getInstalacionesConCoordenadas } from "@/lib/queries";
import { getPresenciaPorEntidad } from "@/lib/presencia";
import { PresenceMap } from "@/components/ui/PresenceMap";

/**
 * MapaInteractivo se carga solo en el cliente (Leaflet usa window / document).
 * La vista SSR muestra un skeleton hasta que el mapa hidrata.
 */
const MapaInteractivo = dynamic(
  () =>
    import("@/components/ui/MapaInteractivo").then((m) => m.MapaInteractivo),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] items-center justify-center rounded-lg border border-border bg-bg-surface/30">
        <p className="text-sm text-text-muted animate-pulse">
          Cargando mapa…
        </p>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Mapa de instalaciones",
  description:
    "Mapa interactivo de instalaciones militares, navales y de seguridad en México: academias, bases, zonas navales, aeropuertos militares y centros C4/C5. Datos de fuentes oficiales y de acceso público.",
};

export default async function MapaPage() {
  const [instalaciones, presenciaEstados] = await Promise.all([
    getInstalacionesConCoordenadas(),
    getPresenciaPorEntidad(),
  ]);

  const dependencias = [
    ...new Set(instalaciones.map((i) => i.dependencia).filter(Boolean)),
  ] as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-2">
            Sección · Diferenciador
          </p>
          <h1 className="text-3xl font-bold text-text mb-3">
            Mapa de instalaciones
          </h1>
          <p className="text-base text-text-muted max-w-2xl leading-relaxed">
            Instalaciones militares, navales y de seguridad con ubicación
            aproximada de dominio público: academias, bases, zonas navales,
            aeropuertos militares y centros de coordinación. Haz clic en un
            marcador para ver la ficha.
          </p>
        </div>
        <Link
          href="/instalaciones"
          className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          <span>Ver catálogo</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Leyenda de colores */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {[
          { dep: "SEDENA", color: "#4ade80" },
          { dep: "SEMAR", color: "#38bdf8" },
          { dep: "Fuerza Aérea Mexicana", color: "#a78bfa" },
          { dep: "Guardia Nacional", color: "#fb923c" },
          { dep: "CENAPRED / SSPC", color: "#facc15" },
        ]
          .filter((l) => dependencias.includes(l.dep))
          .map((l) => (
            <span
              key={l.dep}
              className="flex items-center gap-1.5 text-xs text-text-muted"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              {l.dep}
            </span>
          ))}
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
          Otras dependencias
        </span>
      </div>

      {/* Mapa Leaflet */}
      <div className="rounded-lg overflow-hidden border border-border mb-4">
        <MapaInteractivo instalaciones={instalaciones} height="520px" />
      </div>

      <p className="mb-10 text-[13px] text-text-muted/60 leading-relaxed max-w-3xl">
        <strong className="text-text-muted/80">Aviso:</strong> las coordenadas
        son <strong>aproximadas</strong> y corresponden a ubicaciones de dominio
        público (gob.mx y sitios oficiales). No se incluyen localizaciones
        precisas de instalaciones operativas sensibles. Datos con fines
        educativos e informativos.{" "}
        <span className="font-mono">{instalaciones.length} instalaciones indexadas.</span>
      </p>

      {/* Divider */}
      <div className="border-t border-border mb-10" />

      {/* Cartograma de presencia por entidad */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-text mb-1">
            Presencia institucional por entidad
          </h2>
          <p className="text-sm text-text-muted max-w-2xl">
            Vista complementaria: cada mosaico representa una entidad
            federativa. La intensidad refleja cuántos elementos institucionales
            (mando territorial, instalaciones indexadas, presencia naval) están
            documentados en esta base — no la capacidad operativa real.
          </p>
        </div>
        <PresenceMap estados={presenciaEstados} />
      </section>

      <p className="mt-6 text-[13px] text-text-muted/50">
        Información con fines educativos e informativos, compilada de fuentes
        oficiales y de acceso público.
      </p>
    </div>
  );
}
