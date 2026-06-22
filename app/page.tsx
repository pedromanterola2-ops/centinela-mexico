import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { TotalsBlock } from "@/components/home/TotalsBlock";
import { SectionGrid } from "@/components/home/SectionGrid";
import { MiniMapContainer } from "@/components/home/MiniMapContainer";
import { getTotalesIndexados } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Centinela México — Base de datos de fuerzas de seguridad",
  description:
    "Información educativa sobre las fuerzas armadas, estados, equipamiento y operativos de México. Fuentes oficiales.",
};

export default async function HomePage() {
  const totales = await getTotalesIndexados();

  const heroStats = [
    { label: "Fuerzas / dependencias", value: String(totales.fuerzas_armadas), accent: true },
    { label: "Entidades federativas", value: String(totales.estados) },
    { label: "Equipos catalogados", value: String(totales.equipamiento) },
    { label: "Instalaciones indexadas", value: String(totales.instalaciones) },
  ];

  return (
    <>
      {/* Hero + búsqueda global */}
      <Hero stats={heroStats} />

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
