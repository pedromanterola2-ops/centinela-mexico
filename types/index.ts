/**
 * Interfaces de dominio — alineadas con la DB (database.ts).
 * Usar estos tipos en componentes y páginas; usar los Row types
 * de database.ts solo en lib/queries/*.
 */

import type {
  TipoFuerza,
  CategoriaEquipamiento,
  TipoOperativo,
  TipoDesastre,
  CategoriaInstalacion,
  Json,
} from "./database";

// Re-exportamos los enums para que los componentes no importen database.ts
export type {
  TipoFuerza,
  CategoriaEquipamiento,
  TipoOperativo,
  TipoDesastre,
  CategoriaInstalacion,
};

// ---------------------------------------------------------------------------
// Entidades principales
// ---------------------------------------------------------------------------

export interface FuerzaArmada {
  id: string;
  slug: string;
  nombre: string;
  siglas: string | null;
  tipo: TipoFuerza;
  dependencia: string | null;
  anio_fundacion: number | null;
  mision: string | null;
  efectivos_aprox: number | null;
  presupuesto_aprox: number | null;
  anio_presupuesto: number | null;
  estructura: Json;
  descripcion: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface Estado {
  id: string;
  slug: string;
  nombre: string;
  capital: string | null;
  region: string | null;
  poblacion: number | null;
  corporacion_estatal: string | null;
  secretaria_seguridad: string | null;
  efectivos_aprox: number | null;
  presupuesto_seguridad: number | null;
  estructura: Json;
  descripcion: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  // campos añadidos en migración 003
  litoral: string | null;
  frontera: string | null;
  zona_militar: string | null;
  region_militar: string | null;
  presencia_naval: boolean;
  zona_naval: string | null;
  riesgos_principales: string[];
  created_at: string;
  updated_at: string;
}

export interface Equipamiento {
  id: string;
  slug: string;
  nombre: string;
  categoria: CategoriaEquipamiento;
  origen_pais: string | null;
  operador: string | null;
  cantidad_aprox: number | null;
  anio: number | null;
  descripcion: string | null;
  imagen_url: string | null;
  /** URL de la página de Commons donde está la imagen (para crédito) */
  imagen_fuente?: string | null;
  /** Licencia de la imagen, e.g. "CC BY-SA", "Public Domain" */
  imagen_licencia?: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface Operativo {
  id: string;
  slug: string;
  nombre: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  tipo: TipoOperativo | null;
  entidades_involucradas: string[];
  descripcion: string | null;
  resultado: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface Desastre {
  id: string;
  slug: string;
  nombre: string;
  tipo: TipoDesastre | null;
  fecha: string | null;
  estados_afectados: string[];
  respuesta_institucional: string | null;
  descripcion: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  // campos añadidos en migración 003
  magnitud: string | null;
  muertos_aprox: number | null;
  damnificados_aprox: number | null;
  created_at: string;
  updated_at: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  fuente_oficial: string | null;
  url: string | null;
  fecha: string | null;
  resumen: string | null;
  dependencia: string | null;
  categoria: string | null;
  created_at: string;
}

export interface Instalacion {
  id: string;
  nombre: string;
  categoria: CategoriaInstalacion;
  estado: string | null;
  lat: number | null;
  lng: number | null;
  dependencia: string | null;
  descripcion: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlosarioEntry {
  id: string;
  termino: string;
  definicion: string | null;
  siglas: string | null;
  categoria: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Totales para el home
// ---------------------------------------------------------------------------

export interface TotalesIndexados {
  fuerzas_armadas: number;
  estados: number;
  equipamiento: number;
  operativos: number;
  desastres: number;
  instalaciones: number;
  noticias: number;
  glosario: number;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** Marca que el componente debe mostrar "dato pendiente de verificación" */
export type WithPendiente<T> = T & { pendiente_verificacion: boolean };

/** Resultado paginado genérico */
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
