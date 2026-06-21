/**
 * Tipos generados a partir del esquema de Supabase.
 * Refleja supabase/migrations/001_initial_schema.sql
 * Actualizar al hacer migraciones, o ejecutar: supabase gen types typescript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type TipoFuerza =
  | "fuerza_armada"
  | "fuerza_seguridad"
  | "policia_federal"
  | "organismo_civil"
  | "dependencia_seguridad";

export type CategoriaEquipamiento =
  | "terrestre"
  | "aereo"
  | "naval"
  | "individual"
  | "otro";

export type TipoOperativo =
  | "seguridad"
  | "desastre"
  | "ceremonial"
  | "humanitario"
  | "mixto";

export type TipoDesastre =
  | "sismo"
  | "huracan"
  | "inundacion"
  | "incendio"
  | "sequia"
  | "vulcanico"
  | "otro";

export type CategoriaInstalacion =
  | "base_militar"
  | "zona_naval"
  | "aeropuerto_militar"
  | "coordinacion_estatal"
  | "coordinacion_gn"
  | "c4_c5"
  | "academia"
  | "hospital_militar"
  | "astillero"
  | "proteccion_civil"
  | "industria_militar"
  | "otro";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export interface FuerzaArmadaRow {
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

export interface EstadoRow {
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
  riesgos_principales: Json;
  created_at: string;
  updated_at: string;
}

export interface EquipamientoRow {
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
  imagen_fuente: string | null;
  imagen_licencia: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface OperativoRow {
  id: string;
  slug: string;
  nombre: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  tipo: TipoOperativo | null;
  entidades_involucradas: Json;
  descripcion: string | null;
  resultado: string | null;
  fuente_url: string | null;
  pendiente_verificacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesastreRow {
  id: string;
  slug: string;
  nombre: string;
  tipo: TipoDesastre | null;
  fecha: string | null;
  estados_afectados: Json;
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

export interface NoticiaRow {
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

export interface InstalacionRow {
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

export interface GlosarioRow {
  id: string;
  termino: string;
  definicion: string | null;
  siglas: string | null;
  categoria: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Insert types
// ---------------------------------------------------------------------------

export type FuerzaArmadaInsert = Omit<FuerzaArmadaRow, "id" | "created_at" | "updated_at">;
export type EstadoInsert       = Omit<EstadoRow,        "id" | "created_at" | "updated_at">;
export type EquipamientoInsert = Omit<EquipamientoRow,  "id" | "created_at" | "updated_at">;
export type OperativoInsert    = Omit<OperativoRow,     "id" | "created_at" | "updated_at">;
export type DesastreInsert     = Omit<DesastreRow,      "id" | "created_at" | "updated_at">;
export type NoticiaInsert      = Omit<NoticiaRow,       "id" | "created_at">;
export type InstalacionInsert  = Omit<InstalacionRow,   "id" | "created_at" | "updated_at">;
export type GlosarioInsert     = Omit<GlosarioRow,      "id" | "created_at">;

// ---------------------------------------------------------------------------
// Database interface para el cliente Supabase tipado
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      fuerzas_armadas: {
        Row:    FuerzaArmadaRow;
        Insert: FuerzaArmadaInsert;
        Update: Partial<FuerzaArmadaInsert>;
      };
      estados: {
        Row:    EstadoRow;
        Insert: EstadoInsert;
        Update: Partial<EstadoInsert>;
      };
      equipamiento: {
        Row:    EquipamientoRow;
        Insert: EquipamientoInsert;
        Update: Partial<EquipamientoInsert>;
      };
      operativos: {
        Row:    OperativoRow;
        Insert: OperativoInsert;
        Update: Partial<OperativoInsert>;
      };
      desastres: {
        Row:    DesastreRow;
        Insert: DesastreInsert;
        Update: Partial<DesastreInsert>;
      };
      noticias: {
        Row:    NoticiaRow;
        Insert: NoticiaInsert;
        Update: Partial<NoticiaInsert>;
      };
      instalaciones: {
        Row:    InstalacionRow;
        Insert: InstalacionInsert;
        Update: Partial<InstalacionInsert>;
      };
      glosario: {
        Row:    GlosarioRow;
        Insert: GlosarioInsert;
        Update: Partial<GlosarioInsert>;
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
}
