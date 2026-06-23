import { getSupabaseClient } from "@/lib/supabase";
import { seedInstalaciones } from "@/lib/seed";
import type { Instalacion, CategoriaInstalacion } from "@/types";

const TABLE = "instalaciones" as const;

/** Todas las instalaciones */
export async function getAllInstalaciones(): Promise<Instalacion[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → datos del seed curado.
  if (!sb) return seedInstalaciones;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[instalaciones] getAllInstalaciones:", error.message);
    return seedInstalaciones;
  }
  return (data ?? []) as Instalacion[];
}

/** Instalaciones con coordenadas (para el mapa) */
export async function getInstalacionesConCoordenadas(): Promise<Instalacion[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → seed con coordenadas.
  if (!sb)
    return seedInstalaciones.filter((i) => i.lat !== null && i.lng !== null);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .not("lat", "is", null)
    .not("lng", "is", null)
    .order("nombre", { ascending: true });

  if (error) {
    console.error(
      "[instalaciones] getInstalacionesConCoordenadas:",
      error.message
    );
    return seedInstalaciones.filter((i) => i.lat !== null && i.lng !== null);
  }
  return (data ?? []) as Instalacion[];
}

/** Instalaciones por categoría */
export async function getInstalacionesByCategoria(
  categoria: CategoriaInstalacion
): Promise<Instalacion[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed.
  if (!sb) return seedInstalaciones.filter((i) => i.categoria === categoria);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("categoria", categoria)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[instalaciones] getInstalacionesByCategoria:", error.message);
    return seedInstalaciones.filter((i) => i.categoria === categoria);
  }
  return (data ?? []) as Instalacion[];
}

/** Instalación por id (slug) */
export async function getInstalacionById(
  id: string
): Promise<Instalacion | null> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → buscamos en el seed.
  if (!sb) return seedInstalaciones.find((i) => i.id === id) ?? null;

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[instalaciones] getInstalacionById:", error.message);
    return seedInstalaciones.find((i) => i.id === id) ?? null;
  }
  return (data ?? null) as Instalacion | null;
}

/** Instalaciones por estado */
export async function getInstalacionesByEstado(
  estado: string
): Promise<Instalacion[]> {
  const sb = getSupabaseClient();
  // Sin Supabase configurado → filtramos el seed.
  if (!sb) return seedInstalaciones.filter((i) => i.estado === estado);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("estado", estado)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[instalaciones] getInstalacionesByEstado:", error.message);
    return seedInstalaciones.filter((i) => i.estado === estado);
  }
  return (data ?? []) as Instalacion[];
}
