import { getSupabaseClient } from "@/lib/supabase";
import { seedDesastres, seedDesastreBySlug } from "@/lib/seed";
import type { Desastre, TipoDesastre } from "@/types";

const TABLE = "desastres" as const;

/** Todos los desastres, más recientes primero */
export async function getAllDesastres(): Promise<Desastre[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedDesastres;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("[desastres] getAllDesastres:", error.message);
    return seedDesastres;
  }
  return (data ?? []) as Desastre[];
}

/** Desastres filtrados por tipo */
export async function getDesastresByTipo(
  tipo: TipoDesastre
): Promise<Desastre[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed curado.
  if (!sb) return seedDesastres.filter((d) => d.tipo === tipo);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("tipo", tipo)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("[desastres] getDesastresByTipo:", error.message);
    return seedDesastres.filter((d) => d.tipo === tipo);
  }
  return (data ?? []) as Desastre[];
}

/** Un desastre por slug */
export async function getDesastreBySlug(
  slug: string
): Promise<Desastre | null> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedDesastreBySlug(slug);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[desastres] getDesastreBySlug:", error.message);
    }
    // Ante error real o fila inexistente, intentamos el seed como respaldo.
    return seedDesastreBySlug(slug);
  }
  return data as Desastre;
}
