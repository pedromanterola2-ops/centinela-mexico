import { getSupabaseClient } from "@/lib/supabase";
import { seedEquipamiento, seedEquipamientoBySlug } from "@/lib/seed";
import type { Equipamiento, CategoriaEquipamiento } from "@/types";

const TABLE = "equipamiento" as const;

/** Todo el equipamiento, orden por nombre */
export async function getAllEquipamiento(): Promise<Equipamiento[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedEquipamiento;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[equipamiento] getAllEquipamiento:", error.message);
    return seedEquipamiento;
  }
  return (data ?? []) as Equipamiento[];
}

/** Equipamiento filtrado por categoría */
export async function getEquipamientoByCategoria(
  categoria: CategoriaEquipamiento
): Promise<Equipamiento[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed curado.
  if (!sb) return seedEquipamiento.filter((e) => e.categoria === categoria);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("categoria", categoria)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[equipamiento] getEquipamientoByCategoria:", error.message);
    return seedEquipamiento.filter((e) => e.categoria === categoria);
  }
  return (data ?? []) as Equipamiento[];
}

/** Un ítem de equipamiento por slug */
export async function getEquipamientoBySlug(
  slug: string
): Promise<Equipamiento | null> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedEquipamientoBySlug(slug);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[equipamiento] getEquipamientoBySlug:", error.message);
    }
    // Ante error real o fila inexistente, intentamos el seed como respaldo.
    return seedEquipamientoBySlug(slug);
  }
  return data as Equipamiento;
}

/** Búsqueda por nombre, operador u origen */
export async function searchEquipamiento(q: string): Promise<Equipamiento[]> {
  const sb = getSupabaseClient();
  if (!sb) {
    const ql = q.toLowerCase();
    return seedEquipamiento
      .filter(
        (e) =>
          e.nombre.toLowerCase().includes(ql) ||
          (e.operador ?? "").toLowerCase().includes(ql) ||
          (e.origen_pais ?? "").toLowerCase().includes(ql)
      )
      .slice(0, 10);
  }

  const { data, error } = await sb
    .from(TABLE)
    .select("id, slug, nombre, categoria, origen_pais, operador")
    .or(
      `nombre.ilike.%${q}%,operador.ilike.%${q}%,origen_pais.ilike.%${q}%`
    )
    .limit(10);

  if (error) {
    console.error("[equipamiento] searchEquipamiento:", error.message);
    return [];
  }
  return (data ?? []) as Equipamiento[];
}
