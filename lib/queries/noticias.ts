import { getSupabaseClient } from "@/lib/supabase";
import { seedNoticias } from "@/lib/seed";
import type { Noticia } from "@/types";

const TABLE = "noticias" as const;

/** Últimas noticias (default 20, más recientes primero) */
export async function getLatestNoticias(limit = 20): Promise<Noticia[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedNoticias.slice(0, limit);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("fecha", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[noticias] getLatestNoticias:", error.message);
    return seedNoticias.slice(0, limit);
  }
  return (data ?? []) as Noticia[];
}

/** Noticias filtradas por dependencia */
export async function getNoticiasByDependencia(
  dependencia: string
): Promise<Noticia[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed curado.
  if (!sb)
    return seedNoticias.filter((n) =>
      (n.dependencia ?? "").toLowerCase().includes(dependencia.toLowerCase())
    );

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .ilike("dependencia", `%${dependencia}%`)
    .order("fecha", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[noticias] getNoticiasByDependencia:", error.message);
    return seedNoticias.filter((n) =>
      (n.dependencia ?? "").toLowerCase().includes(dependencia.toLowerCase())
    );
  }
  return (data ?? []) as Noticia[];
}

/** Noticias filtradas por categoría */
export async function getNoticiasByCategoria(
  categoria: string
): Promise<Noticia[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed curado.
  if (!sb) return seedNoticias.filter((n) => n.categoria === categoria);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("categoria", categoria)
    .order("fecha", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[noticias] getNoticiasByCategoria:", error.message);
    return seedNoticias.filter((n) => n.categoria === categoria);
  }
  return (data ?? []) as Noticia[];
}
