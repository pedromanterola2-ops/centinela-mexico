type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[];

/** Combina clases de Tailwind de forma condicional (sin dependencias externas) */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity as 1)
    .filter((x) => x && typeof x === "string")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Formatea números con separador de miles */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-MX").format(n);
}

/** Convierte un texto a slug URL-safe */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Etiqueta legible para el enum TipoFuerza */
export function tipoFuerzaLabel(tipo: string): string {
  const map: Record<string, string> = {
    fuerza_armada:         "Fuerza armada",
    fuerza_seguridad:      "Fuerza de seguridad",
    policia_federal:       "Policía federal",
    organismo_civil:       "Organismo civil",
    dependencia_seguridad: "Dependencia de seguridad",
  };
  return map[tipo] ?? tipo;
}

/** Etiqueta legible para el enum CategoriaEquipamiento */
export function categoriaEquipamientoLabel(categoria: string): string {
  const map: Record<string, string> = {
    terrestre: "Terrestre",
    aereo: "Aéreo",
    naval: "Naval",
    individual: "Individual",
    otro: "Otro",
  };
  return map[categoria] ?? categoria;
}

/** Etiqueta legible para el enum TipoOperativo */
export function tipoOperativoLabel(tipo: string | null): string {
  if (!tipo) return "Sin clasificar";
  const map: Record<string, string> = {
    seguridad: "Seguridad",
    desastre: "Desastre",
    ceremonial: "Ceremonial",
    humanitario: "Humanitario",
    mixto: "Mixto",
  };
  return map[tipo] ?? tipo;
}

/** Etiqueta legible para el enum CategoriaInstalacion */
export function categoriaInstalacionLabel(categoria: string): string {
  const map: Record<string, string> = {
    base_militar: "Base militar",
    zona_naval: "Zona naval",
    aeropuerto_militar: "Aeropuerto militar",
    coordinacion_estatal: "Coordinación estatal",
    coordinacion_gn: "Coordinación GN",
    c4_c5: "Centro C4 / C5",
    academia: "Academia",
    hospital_militar: "Hospital militar",
    astillero: "Astillero (ASTIMAR)",
    proteccion_civil: "Protección Civil",
    industria_militar: "Industria militar",
    otro: "Otro",
  };
  return map[categoria] ?? categoria;
}

/** Etiqueta legible para el enum TipoDesastre */
export function tipoDesastreLabel(tipo: string | null): string {
  if (!tipo) return "Sin clasificar";
  const map: Record<string, string> = {
    sismo: "Sismo",
    huracan: "Huracán",
    inundacion: "Inundación",
    incendio: "Incendio",
    sequia: "Sequía",
    vulcanico: "Volcánico",
    otro: "Otro",
  };
  return map[tipo] ?? tipo;
}

/** Etiqueta legible para categoría de glosario */
export function categoriaGlosarioLabel(categoria: string | null): string {
  if (!categoria) return "General";
  const map: Record<string, string> = {
    institucional: "Institucional",
    operativo: "Operativo",
    tecnico: "Técnico",
    juridico: "Jurídico",
    organico: "Orgánico",
    tactico: "Táctico",
    estadistico: "Estadístico",
  };
  return map[categoria] ?? categoria;
}

/** Formatea una fecha ISO (YYYY-MM-DD) a texto legible en español. */
export function formatFecha(iso: string | null): string {
  if (!iso) return "Fecha por confirmar";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Devuelve la década (p. ej. "2010s") de una fecha ISO, o null si no hay fecha. */
export function decadaDe(iso: string | null): string | null {
  if (!iso) return null;
  const anio = parseInt(iso.slice(0, 4), 10);
  if (Number.isNaN(anio)) return null;
  return `${Math.floor(anio / 10) * 10}s`;
}

/** Mapea el texto de un operador al slug de su ficha de fuerza armada, si aplica. */
export function operadorToFuerzaSlug(operador: string | null): string | null {
  if (!operador) return null;
  const o = operador.toLowerCase();
  if (o.includes("semar") || o.includes("armada") || o.includes("marina"))
    return "armada-de-mexico";
  if (o.includes("aérea") || o.includes("aerea") || o.includes("fam"))
    return "fuerza-aerea-mexicana";
  if (o.includes("guardia nacional")) return "guardia-nacional";
  if (o.includes("sedena") || o.includes("ejército") || o.includes("ejercito"))
    return "sedena";
  return null;
}

/** Convierte una clave snake_case en una etiqueta legible: "regiones_militares" → "Regiones militares" */
export function humanizeKey(key: string): string {
  const text = key.replace(/_/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Separa una estructura JSON en campos escalares (número/texto) y listas
 * (arrays). Usado por las fichas de fuerzas y estados para renderizar
 * StatBlocks (escalares) y listas de chips (arrays).
 */
export function parseEstructura(estructura: unknown): {
  escalares: { key: string; value: string | number | null }[];
  listas: { key: string; value: string[] }[];
} {
  const escalares: { key: string; value: string | number | null }[] = [];
  const listas: { key: string; value: string[] }[] = [];

  if (
    estructura &&
    typeof estructura === "object" &&
    !Array.isArray(estructura)
  ) {
    for (const [key, value] of Object.entries(
      estructura as Record<string, unknown>
    )) {
      if (Array.isArray(value)) {
        listas.push({ key, value: value.map(String) });
      } else if (typeof value === "number" || typeof value === "string") {
        escalares.push({ key, value });
      } else if (value === null) {
        escalares.push({ key, value: null });
      }
    }
  }
  return { escalares, listas };
}

/** Extrae el host de una URL para mostrarla de forma compacta */
export function hostFromUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
