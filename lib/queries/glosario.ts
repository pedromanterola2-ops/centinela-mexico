import { getSupabaseClient } from "@/lib/supabase";
import { seedGlosario, seedSearchGlosario } from "@/lib/seed";
import type { GlosarioEntry } from "@/types";

const TABLE = "glosario" as const;

/** Todo el glosario, orden alfabético */
export async function getAllGlosario(): Promise<GlosarioEntry[]> {
  const sb = getSupabaseClient();
  if (!sb) return seedGlosario;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("termino", { ascending: true });

  if (error) {
    console.error("[glosario] getAllGlosario:", error.message);
    return seedGlosario;
  }
  return (data ?? []) as GlosarioEntry[];
}

/** Búsqueda por término o siglas */
export async function searchGlosario(q: string): Promise<GlosarioEntry[]> {
  const sb = getSupabaseClient();
  if (!sb) return seedSearchGlosario(q).slice(0, 20);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .or(`termino.ilike.%${q}%,siglas.ilike.%${q}%,definicion.ilike.%${q}%`)
    .order("termino", { ascending: true })
    .limit(20);

  if (error) {
    console.error("[glosario] searchGlosario:", error.message);
    return seedSearchGlosario(q).slice(0, 20);
  }
  return (data ?? []) as GlosarioEntry[];
}
