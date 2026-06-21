import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
const db = new PGlite();
const sql = (f) => readFileSync(f, "utf8");
try {
  await db.exec(sql("supabase/migrations/001_initial_schema.sql"));
  await db.exec(sql("supabase/migrations/002_estados_estructura.sql"));
  await db.exec(sql("supabase/seed.sql"));
  // re-ejecutar seed para probar idempotencia (ON CONFLICT)
  await db.exec(sql("supabase/seed.sql"));
  const tables = ["fuerzas_armadas","estados","equipamiento","operativos","desastres","noticias","instalaciones","glosario"];
  for (const t of tables) {
    const r = await db.query(`SELECT count(*)::int AS n FROM ${t}`);
    console.log(t.padEnd(18), r.rows[0].n);
  }
  // verifica que estructura jsonb se cargó en estados
  const e = await db.query("SELECT count(*)::int AS n FROM estados WHERE estructura <> '{}'::jsonb");
  console.log("estados con estructura:", e.rows[0].n);
  console.log("OK ✅ seed.sql carga sin errores (y es idempotente)");
} catch (err) {
  console.error("ERROR ❌", err.message);
  process.exit(1);
}
