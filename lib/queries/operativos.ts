import { getSupabaseClient } from "@/lib/supabase";
import { seedOperativos, seedOperativoBySlug } from "@/lib/seed";
import type { Operativo, TipoOperativo } from "@/types";

const TABLE = "operativos" as const;

/** Todos los operativos, más recientes primero */
export async function getAllOperativos(): Promise<Operativo[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedOperativos;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("fecha_inicio", { ascending: false });

  if (error) {
    console.error("[operativos] getAllOperativos:", error.message);
    return seedOperativos;
  }
  return (data ?? []) as Operativo[];
}

/** Operativos filtrados por tipo */
export async function getOperativosByTipo(
  tipo: TipoOperativo
): Promise<Operativo[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed curado.
  if (!sb) return seedOperativos.filter((o) => o.tipo === tipo);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("tipo", tipo)
    .order("fecha_inicio", { ascending: false });

  if (error) {
    console.error("[operativos] getOperativosByTipo:", error.message);
    return seedOperativos.filter((o) => o.tipo === tipo);
  }
  return (data ?? []) as Operativo[];
}

/** Un operativo por slug */
export async function getOperativoBySlug(
  slug: string
): Promise<Operativo | null> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedOperativoBySlug(slug);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[operativos] getOperativoBySlug:", error.message);
    }
    // Ante error real o fila inexistente, intentamos el seed como respaldo.
    return seedOperativoBySlug(slug);
  }
  return data as Operativo;
}
