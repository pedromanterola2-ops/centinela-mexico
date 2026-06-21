import fuentesJson from "@/seed/fuentes.json";

export type FuenteTier = "oficial" | "especializada";
export type FuenteTipo = "gobierno" | "medio" | "youtube";
export type FuenteIngesta = "activa" | "no_disponible" | "ninguna";

export interface Fuente {
  slug: string;
  nombre: string;
  descripcion: string;
  url: string;
  rss_url: string | null;
  tier: FuenteTier;
  tipo: FuenteTipo;
  pais: string;
  ingesta: FuenteIngesta;
  prioridad: boolean;
}

export const fuentes: Fuente[] = fuentesJson as Fuente[];

/** Fuentes por nivel, en el orden del seed. */
export function fuentesPorTier(tier: FuenteTier): Fuente[] {
  return fuentes.filter((f) => f.tier === tier);
}

/** Fuentes con ingesta activa (tienen feed utilizable). */
export function fuentesIngeribles(): Fuente[] {
  return fuentes.filter((f) => f.ingesta === "activa" && !!f.rss_url);
}

/** Etiqueta legible del país/origen. */
export function paisLabel(pais: string): string {
  const map: Record<string, string> = {
    MX: "México",
    ES: "España",
    AR: "Argentina",
    INT: "Internacional",
  };
  return map[pais] ?? pais;
}
