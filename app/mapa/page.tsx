import type { Metadata } from "next";
import { getInstalacionesConCoordenadas } from "@/lib/queries";
import { MapView } from "@/components/ui/MapView";

export const metadata: Metadata = {
  title: "Mapa Interactivo",
  description:
    "Mapa interactivo de instalaciones de seguridad y defensa de México (bases militares, zonas navales, aeropuertos militares, C4/C5, academias). Datos de fuentes públicas; ubicaciones aproximadas.",
};

export default async function MapaPage() {
  const instalaciones = await getInstalacionesConCoordenadas();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de sección */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
          Sección · Diferenciador
        </p>
        <h1 className="text-3xl font-bold text-text mb-3">Mapa interactivo</h1>
        <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
          Instalaciones de seguridad y defensa por categoría. Activa o desactiva
          capas, filtra por estado y haz clic en un marcador para ver su ficha.
          Mapa con MapLibre GL JS y OpenStreetMap.
        </p>
      </div>

      <MapView instalaciones={instalaciones} />

      <p className="mt-4 text-[11px] text-text-muted/60 leading-relaxed max-w-3xl">
        Aviso: las coordenadas mostradas son <strong>aproximadas, a nivel
        localidad</strong>, y provienen de la ubicación pública de instituciones
        conocidas. No representan ubicaciones precisas ni operativas. Los puntos
        marcados &quot;en verificación&quot; aún no cuentan con fuente oficial
        confirmada de su localización exacta. Información con fines educativos e
        informativos.
      </p>
    </div>
  );
}
