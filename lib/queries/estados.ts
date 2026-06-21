import { getSupabaseClient } from "@/lib/supabase";
import { seedEstados, seedEstadoBySlug } from "@/lib/seed";
import type { Estado } from "@/types";

const TABLE = "estados" as const;

/** Todos los estados, ordenados por nombre */
export async function getAllEstados(): Promise<Estado[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedEstados;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[estados] getAllEstados:", error.message);
    return seedEstados;
  }
  return (data ?? []) as Estado[];
}

/** Estados filtrados por región */
export async function getEstadosByRegion(region: string): Promise<Estado[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed curado.
  if (!sb) return seedEstados.filter((e) => e.region === region);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("region", region)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[estados] getEstadosByRegion:", error.message);
    return seedEstados.filter((e) => e.region === region);
  }
  return (data ?? []) as Estado[];
}

/** Un estado por slug */
export async function getEstadoBySlug(slug: string): Promise<Estado | null> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedEstadoBySlug(slug);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[estados] getEstadoBySlug:", error.message);
    }
    // Ante error real o fila inexistente, intentamos el seed como respaldo.
    return seedEstadoBySlug(slug);
  }
  return data as Estado;
}

/** Búsqueda por nombre, capital o corporación */
export async function searchEstados(q: string): Promise<Estado[]> {
  const sb = getSupabaseClient();
  if (!sb) {
    const ql = q.toLowerCase();
    return seedEstados
      .filter(
        (e) =>
          e.nombre.toLowerCase().includes(ql) ||
          (e.capital ?? "").toLowerCase().includes(ql) ||
          (e.corporacion_estatal ?? "").toLowerCase().includes(ql)
      )
      .slice(0, 10);
  }

  const { data, error } = await sb
    .from(TABLE)
    .select("id, slug, nombre, capital, region, corporacion_estatal")
    .or(
      `nombre.ilike.%${q}%,capital.ilike.%${q}%,corporacion_estatal.ilike.%${q}%`
    )
    .limit(10);

  if (error) {
    console.error("[estados] searchEstados:", error.message);
    return [];
  }
  return (data ?? []) as Estado[];
}
