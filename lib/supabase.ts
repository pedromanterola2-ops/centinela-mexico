import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase para uso en el browser / Server Components.
 * Las variables de entorno se leen en tiempo de ejecución, no en build.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Durante el build estático Next.js puede llamar sin variables reales.
    // Devolvemos null para que los componentes manejen el caso sin datos.
    return null;
  }

  return createClient<Database>(url, key);
}

/** Singleton perezoso para uso en componentes cliente */
let _client: ReturnType<typeof createClient<Database>> | null = null;

export function supabase() {
  if (_client) return _client;
  const client = getSupabaseClient();
  if (client) _client = client;
  return client;
}

/** Cliente con service role para scripts de seed (solo usar en servidor/scripts) */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Variables de entorno de Supabase (service role) no definidas");
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}
