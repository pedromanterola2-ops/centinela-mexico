import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { TotalsBlock } from "@/components/home/TotalsBlock";
import { SectionGrid } from "@/components/home/SectionGrid";
import { MiniMapContainer } from "@/components/home/MiniMapContainer";
import {
  getAllFuerzasArmadas,
  getAllEstados,
  getAllEquipamiento,
  getAllOperativos,
  getAllDesastres,
  getInstalacionesConCoordenadas,
  getAllGlosario,
  getLatestNoticias,
} from "@/lib/queries";
import type { TotalesIndexados } from "@/types";

export const metadata: Metadata = {
  title: "Centinela México — Base de datos de fuerzas de seguridad",
  description:
    "Información educativa sobre las fuerzas armadas, estados, equipamiento y operativos de México. Fuentes oficiales.",
};

async function getTotales(): Promise<TotalesIndexados> {
  const [fuerzas, estados, equipamiento, operativos, desastres, instalaciones, glosario, noticias] =
    await Promise.all([
      getAllFuerzasArmadas(),
      getAllEstados(),
      getAllEquipamiento(),
      getAllOperativos(),
      getAllDesastres(),
      getInstalacionesConCoordenadas(),
      getAllGlosario(),
      getLatestNoticias(1000),
    ]);
  return {
    fuerzas_armadas: fuerzas.length,
    estados: estados.length,
    equipamiento: equipamiento.length,
    operativos: operativos.length,
    desastres: desastres.length,
    instalaciones: instalaciones.length,
    glosario: glosario.length,
    noticias: noticias.length,
  };
}

export default async function HomePage() {
  const totales = await getTotales();

  return (
    <>
      {/* Hero + búsqueda global */}
      <Hero />

      <div className="pb-4">
        <SearchBar />
      </div>

      {/* Bloque de totales indexados — datos reales del seed/Supabase */}
      <TotalsBlock totales={totales} />

      {/* Grid de accesos a secciones */}
      <SectionGrid />

      {/* Contenedor mini-mapa */}
      <MiniMapContainer />
    </>
  );
}
