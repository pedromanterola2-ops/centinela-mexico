import { getSupabaseClient } from "@/lib/supabase";
import { seedFuerzasArmadas, seedFuerzaBySlug } from "@/lib/seed";
import type { FuerzaArmada } from "@/types";

const TABLE = "fuerzas_armadas" as const;

/** Todas las fuerzas armadas, ordenadas por año de fundación */
export async function getAllFuerzasArmadas(): Promise<FuerzaArmada[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedFuerzasArmadas;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("anio_fundacion", { ascending: true });

  if (error) {
    console.error("[fuerzas-armadas] getAllFuerzasArmadas:", error.message);
    return seedFuerzasArmadas;
  }
  return (data ?? []) as FuerzaArmada[];
}

/** Una fuerza por slug */
export async function getFuerzaBySlug(
  slug: string
): Promise<FuerzaArmada | null> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedFuerzaBySlug(slug);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116 = "no rows returned" — no es un error real
      console.error("[fuerzas-armadas] getFuerzaBySlug:", error.message);
    }
    // Ante error real o fila inexistente, intentamos el seed como respaldo.
    return seedFuerzaBySlug(slug);
  }
  return data as FuerzaArmada;
}

/** Búsqueda por nombre o siglas */
export async function searchFuerzas(q: string): Promise<FuerzaArmada[]> {
  const sb = getSupabaseClient();
  if (!sb) {
    const ql = q.toLowerCase();
    return seedFuerzasArmadas
      .filter(
        (f) =>
          f.nombre.toLowerCase().includes(ql) ||
          (f.siglas ?? "").toLowerCase().includes(ql)
      )
      .slice(0, 10);
  }

  const { data, error } = await sb
    .from(TABLE)
    .select("id, slug, nombre, siglas, tipo, dependencia")
    .or(`nombre.ilike.%${q}%,siglas.ilike.%${q}%`)
    .limit(10);

  if (error) {
    console.error("[fuerzas-armadas] searchFuerzas:", error.message);
    return [];
  }
  return (data ?? []) as FuerzaArmada[];
}
