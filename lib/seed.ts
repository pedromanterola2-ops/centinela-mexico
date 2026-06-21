/**
 * Loader de datos semilla (seed).
 *
 * Lee los JSON curados de seed/ y los normaliza a los tipos de dominio.
 * Sirve como fuente de datos mientras Supabase no está conectado, respetando
 * el principio "seed primero". Los datos NO viven en los componentes: viven
 * en seed/*.json versionado, y este módulo es el único punto de carga.
 *
 * Los campos que la base de datos generaría (id, created_at, updated_at) se
 * sintetizan a partir del slug para mantener la forma del tipo.
 */

import fuerzasJson from "@/seed/fuerzas_armadas.json";
import estadosJson from "@/seed/estados.json";
import equipamientoJson from "@/seed/equipamiento.json";
import operativosJson from "@/seed/operativos.json";
import desastresJson from "@/seed/desastres.json";
import noticiasJson from "@/seed/noticias.json";
import instalacionesJson from "@/seed/instalaciones.json";
import glosarioJson from "@/seed/glosario.json";
import type {
  FuerzaArmada,
  Estado,
  Equipamiento,
  Operativo,
  Desastre,
  Noticia,
  Instalacion,
  GlosarioEntry,
} from "@/types";
import type {
  Json,
  CategoriaEquipamiento,
  TipoOperativo,
  TipoDesastre,
  CategoriaInstalacion,
} from "@/types/database";

interface RawFuerza {
  slug: string;
  nombre: string;
  siglas?: string | null;
  tipo: FuerzaArmada["tipo"];
  dependencia?: string | null;
  anio_fundacion?: number | null;
  mision?: string | null;
  efectivos_aprox?: number | null;
  presupuesto_aprox?: number | null;
  anio_presupuesto?: number | null;
  estructura?: Json;
  descripcion?: string | null;
  fuente_url?: string | null;
  pendiente_verificacion?: boolean;
}

function normalizeFuerza(raw: RawFuerza): FuerzaArmada {
  return {
    id: raw.slug,
    slug: raw.slug,
    nombre: raw.nombre,
    siglas: raw.siglas ?? null,
    tipo: raw.tipo,
    dependencia: raw.dependencia ?? null,
    anio_fundacion: raw.anio_fundacion ?? null,
    mision: raw.mision ?? null,
    efectivos_aprox: raw.efectivos_aprox ?? null,
    presupuesto_aprox: raw.presupuesto_aprox ?? null,
    anio_presupuesto: raw.anio_presupuesto ?? null,
    estructura: raw.estructura ?? null,
    descripcion: raw.descripcion ?? null,
    fuente_url: raw.fuente_url ?? null,
    pendiente_verificacion: raw.pendiente_verificacion ?? false,
    created_at: "",
    updated_at: "",
  };
}

/** Todas las fuerzas armadas del seed, ordenadas por año de fundación. */
export const seedFuerzasArmadas: FuerzaArmada[] = (fuerzasJson as RawFuerza[])
  .map(normalizeFuerza)
  .sort((a, b) => (a.anio_fundacion ?? 0) - (b.anio_fundacion ?? 0));

/** Una fuerza del seed por slug, o null si no existe. */
export function seedFuerzaBySlug(slug: string): FuerzaArmada | null {
  return seedFuerzasArmadas.find((f) => f.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Estados (32 entidades federativas)
// ---------------------------------------------------------------------------

interface RawEstado {
  slug: string;
  nombre: string;
  capital?: string | null;
  region?: string | null;
  poblacion?: number | null;
  corporacion_estatal?: string | null;
  secretaria_seguridad?: string | null;
  efectivos_aprox?: number | null;
  presupuesto_seguridad?: number | null;
  estructura?: Json;
  descripcion?: string | null;
  fuente_url?: string | null;
  pendiente_verificacion?: boolean;
  // campos migración 003
  litoral?: string | null;
  frontera?: string | null;
  zona_militar?: string | null;
  region_militar?: string | null;
  presencia_naval?: boolean;
  zona_naval?: string | null;
  riesgos_principales?: string[];
}

function normalizeEstado(raw: RawEstado): Estado {
  return {
    id: raw.slug,
    slug: raw.slug,
    nombre: raw.nombre,
    capital: raw.capital ?? null,
    region: raw.region ?? null,
    poblacion: raw.poblacion ?? null,
    corporacion_estatal: raw.corporacion_estatal ?? null,
    secretaria_seguridad: raw.secretaria_seguridad ?? null,
    efectivos_aprox: raw.efectivos_aprox ?? null,
    presupuesto_seguridad: raw.presupuesto_seguridad ?? null,
    estructura: raw.estructura ?? null,
    descripcion: raw.descripcion ?? null,
    fuente_url: raw.fuente_url ?? null,
    pendiente_verificacion: raw.pendiente_verificacion ?? false,
    litoral: raw.litoral ?? null,
    frontera: raw.frontera ?? null,
    zona_militar: raw.zona_militar ?? null,
    region_militar: raw.region_militar ?? null,
    presencia_naval: raw.presencia_naval ?? false,
    zona_naval: raw.zona_naval ?? null,
    riesgos_principales: raw.riesgos_principales ?? [],
    created_at: "",
    updated_at: "",
  };
}

/** Todos los estados del seed, ordenados alfabéticamente por nombre. */
export const seedEstados: Estado[] = (estadosJson as RawEstado[])
  .map(normalizeEstado)
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

/** Un estado del seed por slug, o null si no existe. */
export function seedEstadoBySlug(slug: string): Estado | null {
  return seedEstados.find((e) => e.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Equipamiento
// ---------------------------------------------------------------------------

interface RawEquipamiento {
  slug: string;
  nombre: string;
  categoria: CategoriaEquipamiento;
  origen_pais?: string | null;
  operador?: string | null;
  cantidad_aprox?: number | null;
  anio?: number | null;
  descripcion?: string | null;
  imagen_url?: string | null;
  fuente_url?: string | null;
  pendiente_verificacion?: boolean;
}

function normalizeEquipamiento(raw: RawEquipamiento): Equipamiento {
  return {
    id: raw.slug,
    slug: raw.slug,
    nombre: raw.nombre,
    categoria: raw.categoria,
    origen_pais: raw.origen_pais ?? null,
    operador: raw.operador ?? null,
    cantidad_aprox: raw.cantidad_aprox ?? null,
    anio: raw.anio ?? null,
    descripcion: raw.descripcion ?? null,
    imagen_url: raw.imagen_url ?? null,
    fuente_url: raw.fuente_url ?? null,
    pendiente_verificacion: raw.pendiente_verificacion ?? false,
    created_at: "",
    updated_at: "",
  };
}

/** Todo el equipamiento del seed, ordenado por nombre. */
export const seedEquipamiento: Equipamiento[] = (
  equipamientoJson as RawEquipamiento[]
)
  .map(normalizeEquipamiento)
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

/** Un ítem de equipamiento del seed por slug, o null si no existe. */
export function seedEquipamientoBySlug(slug: string): Equipamiento | null {
  return seedEquipamiento.find((e) => e.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Operativos
// ---------------------------------------------------------------------------

interface RawOperativo {
  slug: string;
  nombre: string;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  tipo?: TipoOperativo | null;
  entidades_involucradas?: string[] | null;
  descripcion?: string | null;
  resultado?: string | null;
  fuente_url?: string | null;
  pendiente_verificacion?: boolean;
}

function normalizeOperativo(raw: RawOperativo): Operativo {
  return {
    id: raw.slug,
    slug: raw.slug,
    nombre: raw.nombre,
    fecha_inicio: raw.fecha_inicio ?? null,
    fecha_fin: raw.fecha_fin ?? null,
    tipo: raw.tipo ?? null,
    entidades_involucradas: raw.entidades_involucradas ?? [],
    descripcion: raw.descripcion ?? null,
    resultado: raw.resultado ?? null,
    fuente_url: raw.fuente_url ?? null,
    pendiente_verificacion: raw.pendiente_verificacion ?? false,
    created_at: "",
    updated_at: "",
  };
}

/** Compara dos fechas ISO (o null) para orden descendente; null al final. */
function compareFechaDesc(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a < b ? 1 : -1;
}

/** Todos los operativos del seed, ordenados por fecha (más reciente primero). */
export const seedOperativos: Operativo[] = (operativosJson as RawOperativo[])
  .map(normalizeOperativo)
  .sort((a, b) => compareFechaDesc(a.fecha_inicio, b.fecha_inicio));

/** Un operativo del seed por slug, o null si no existe. */
export function seedOperativoBySlug(slug: string): Operativo | null {
  return seedOperativos.find((o) => o.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Desastres
// ---------------------------------------------------------------------------

interface RawDesastre {
  slug: string;
  nombre: string;
  tipo?: TipoDesastre | null;
  fecha?: string | null;
  estados_afectados?: string[] | null;
  respuesta_institucional?: string | null;
  descripcion?: string | null;
  fuente_url?: string | null;
  pendiente_verificacion?: boolean;
  // campos migración 003
  magnitud?: string | null;
  muertos_aprox?: number | null;
  damnificados_aprox?: number | null;
}

function normalizeDesastre(raw: RawDesastre): Desastre {
  return {
    id: raw.slug,
    slug: raw.slug,
    nombre: raw.nombre,
    tipo: raw.tipo ?? null,
    fecha: raw.fecha ?? null,
    estados_afectados: raw.estados_afectados ?? [],
    respuesta_institucional: raw.respuesta_institucional ?? null,
    descripcion: raw.descripcion ?? null,
    fuente_url: raw.fuente_url ?? null,
    pendiente_verificacion: raw.pendiente_verificacion ?? false,
    magnitud: raw.magnitud ?? null,
    muertos_aprox: raw.muertos_aprox ?? null,
    damnificados_aprox: raw.damnificados_aprox ?? null,
    created_at: "",
    updated_at: "",
  };
}

/** Todos los desastres del seed, ordenados por fecha (más reciente primero). */
export const seedDesastres: Desastre[] = (desastresJson as RawDesastre[])
  .map(normalizeDesastre)
  .sort((a, b) => compareFechaDesc(a.fecha, b.fecha));

/** Un desastre del seed por slug, o null si no existe. */
export function seedDesastreBySlug(slug: string): Desastre | null {
  return seedDesastres.find((d) => d.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Noticias
// ---------------------------------------------------------------------------

interface RawNoticia {
  id: string;
  titulo: string;
  fuente_oficial?: string | null;
  url?: string | null;
  fecha?: string | null;
  resumen?: string | null;
  dependencia?: string | null;
  categoria?: string | null;
}

function normalizeNoticia(raw: RawNoticia): Noticia {
  return {
    id: raw.id,
    titulo: raw.titulo,
    fuente_oficial: raw.fuente_oficial ?? null,
    url: raw.url ?? null,
    fecha: raw.fecha ?? null,
    resumen: raw.resumen ?? null,
    dependencia: raw.dependencia ?? null,
    categoria: raw.categoria ?? null,
    created_at: "",
  };
}

/** Todas las noticias del seed, ordenadas por fecha (más reciente primero). */
export const seedNoticias: Noticia[] = (noticiasJson as RawNoticia[])
  .map(normalizeNoticia)
  .sort((a, b) => compareFechaDesc(a.fecha, b.fecha));

// ---------------------------------------------------------------------------
// Instalaciones
// ---------------------------------------------------------------------------

interface RawInstalacion {
  id: string;
  nombre: string;
  categoria: CategoriaInstalacion;
  estado?: string | null;
  lat?: number | null;
  lng?: number | null;
  dependencia?: string | null;
  descripcion?: string | null;
  fuente_url?: string | null;
  pendiente_verificacion?: boolean;
}

function normalizeInstalacion(raw: RawInstalacion): Instalacion {
  return {
    id: raw.id,
    nombre: raw.nombre,
    categoria: raw.categoria,
    estado: raw.estado ?? null,
    lat: raw.lat ?? null,
    lng: raw.lng ?? null,
    dependencia: raw.dependencia ?? null,
    descripcion: raw.descripcion ?? null,
    fuente_url: raw.fuente_url ?? null,
    pendiente_verificacion: raw.pendiente_verificacion ?? false,
    created_at: "",
    updated_at: "",
  };
}

/** Todas las instalaciones del seed, ordenadas por nombre. */
export const seedInstalaciones: Instalacion[] = (
  instalacionesJson as RawInstalacion[]
)
  .map(normalizeInstalacion)
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// ---------------------------------------------------------------------------
// Glosario
// ---------------------------------------------------------------------------

interface RawGlosario {
  termino: string;
  siglas?: string | null;
  definicion?: string | null;
  categoria?: string | null;
}

function normalizeGlosario(raw: RawGlosario, idx: number): GlosarioEntry {
  return {
    id: raw.siglas
      ? raw.siglas.toLowerCase().replace(/\s+/g, "-")
      : `glosario-${idx}`,
    termino: raw.termino,
    siglas: raw.siglas ?? null,
    definicion: raw.definicion ?? null,
    categoria: raw.categoria ?? null,
    created_at: "",
  };
}

/** Todo el glosario del seed, orden alfabético por término. */
export const seedGlosario: GlosarioEntry[] = (glosarioJson as RawGlosario[])
  .map(normalizeGlosario)
  .sort((a, b) => a.termino.localeCompare(b.termino, "es"));

/** Búsqueda en glosario seed (término, siglas, definición). */
export function seedSearchGlosario(q: string): GlosarioEntry[] {
  const ql = q.toLowerCase();
  return seedGlosario.filter(
    (g) =>
      g.termino.toLowerCase().includes(ql) ||
      (g.siglas ?? "").toLowerCase().includes(ql) ||
      (g.definicion ?? "").toLowerCase().includes(ql)
  );
}
