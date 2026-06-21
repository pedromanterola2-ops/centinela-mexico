/**
 * Barrel de queries — importar desde "@/lib/queries"
 *
 * Uso en Server Components:
 *   import { getAllFuerzasArmadas, getTotalesIndexados } from "@/lib/queries";
 *
 * Nota: todas las funciones devuelven [] / null si Supabase no está
 * configurado (env vars ausentes). Esto permite desarrollar la UI sin BD.
 */

export * from "./fuerzas-armadas";
export * from "./estados";
export * from "./equipamiento";
export * from "./operativos";
export * from "./desastres";
export * from "./noticias";
export * from "./instalaciones";
export * from "./glosario";

// ---------------------------------------------------------------------------
// Totales para el home — una sola query por tabla
// ---------------------------------------------------------------------------

import { getSupabaseClient } from "@/lib/supabase";
import {
  seedFuerzasArmadas,
  seedEstados,
  seedEquipamiento,
  seedOperativos,
  seedDesastres,
  seedInstalaciones,
  seedNoticias,
  seedGlosario,
} from "@/lib/seed";
import type { TotalesIndexados } from "@/types";

/** Cuenta de registros en cada tabla principal. Fallback: conteos del seed. */
export async function getTotalesIndexados(): Promise<TotalesIndexados> {
  const sb = getSupabaseClient();

  const seedFallback: TotalesIndexados = {
    fuerzas_armadas: seedFuerzasArmadas.length,
    estados:         seedEstados.length,
    equipamiento:    seedEquipamiento.length,
    operativos:      seedOperativos.length,
    desastres:       seedDesastres.length,
    instalaciones:   seedInstalaciones.length,
    noticias:        seedNoticias.length,
    glosario:        seedGlosario.length,
  };

  if (!sb) return seedFallback;

  const [fa, est, eq, op, des, ins, not, gl] = await Promise.all([
    sb.from("fuerzas_armadas").select("id", { count: "exact", head: true }),
    sb.from("estados").select("id",          { count: "exact", head: true }),
    sb.from("equipamiento").select("id",     { count: "exact", head: true }),
    sb.from("operativos").select("id",       { count: "exact", head: true }),
    sb.from("desastres").select("id",        { count: "exact", head: true }),
    sb.from("instalaciones").select("id",    { count: "exact", head: true }),
    sb.from("noticias").select("id",         { count: "exact", head: true }),
    sb.from("glosario").select("id",         { count: "exact", head: true }),
  ]);

  return {
    fuerzas_armadas: fa.count  ?? 0,
    estados:         est.count ?? 0,
    equipamiento:    eq.count  ?? 0,
    operativos:      op.count  ?? 0,
    desastres:       des.count ?? 0,
    instalaciones:   ins.count ?? 0,
    noticias:        not.count ?? 0,
    glosario:        gl.count  ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Búsqueda global — combina fuerzas, estados y equipamiento
// ---------------------------------------------------------------------------

import { searchFuerzas }     from "./fuerzas-armadas";
import { searchEstados }     from "./estados";
import { searchEquipamiento } from "./equipamiento";
import { searchGlosario }    from "./glosario";

export interface GlobalSearchResult {
  tipo: "fuerza" | "estado" | "equipamiento" | "glosario";
  id: string;
  slug?: string;
  label: string;
  sublabel?: string;
}

export async function globalSearch(q: string): Promise<GlobalSearchResult[]> {
  if (!q || q.trim().length < 2) return [];

  const [fuerzas, estados, equipamiento, glosario] = await Promise.all([
    searchFuerzas(q),
    searchEstados(q),
    searchEquipamiento(q),
    searchGlosario(q),
  ]);

  const results: GlobalSearchResult[] = [
    ...fuerzas.map((f) => ({
      tipo: "fuerza" as const,
      id:       f.id,
      slug:     f.slug,
      label:    f.nombre,
      sublabel: f.siglas ?? undefined,
    })),
    ...estados.map((e) => ({
      tipo: "estado" as const,
      id:       e.id,
      slug:     e.slug,
      label:    e.nombre,
      sublabel: e.capital ?? undefined,
    })),
    ...equipamiento.map((eq) => ({
      tipo: "equipamiento" as const,
      id:       eq.id,
      slug:     eq.slug,
      label:    eq.nombre,
      sublabel: eq.categoria,
    })),
    ...glosario.map((g) => ({
      tipo: "glosario" as const,
      id:       g.id,
      label:    g.siglas ? `${g.siglas} — ${g.termino}` : g.termino,
    })),
  ];

  return results.slice(0, 12);
}
