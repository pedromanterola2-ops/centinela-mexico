/**
 * Genera supabase/seed.sql a partir de los JSON curados en seed/*.json.
 *
 * Principio "una sola verdad": los datos viven en seed/*.json (versionados,
 * cargados en runtime por lib/seed.ts). Este script proyecta esos mismos
 * datos al SQL de carga inicial de Supabase, para que ambas fuentes nunca
 * diverjan. Re-ejecutar tras editar cualquier seed JSON:
 *
 *   node scripts/generate-seed-sql.mjs
 *
 * Las columnas que la BD genera (id, created_at, updated_at) se omiten.
 * Los INSERT con slug usan ON CONFLICT (slug) DO NOTHING → re-ejecutables.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const read = (name) =>
  JSON.parse(readFileSync(join(ROOT, "seed", name), "utf8"));

// ── Formateadores de valores SQL ───────────────────────────────────────────
function sqlStr(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}
function sqlNum(v) {
  return v === null || v === undefined ? "NULL" : String(v);
}
function sqlBool(v) {
  return v ? "true" : "false";
}
/** Objeto/array JSON → literal de texto que Postgres castea a jsonb. */
function sqlJson(v, fallback) {
  if (v === null || v === undefined) return fallback;
  return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
}

/** Construye un bloque INSERT con tuplas formateadas. */
function buildInsert(table, columns, rows, formatRow, { conflict } = {}) {
  const cols = `  (${columns})`;
  const tuples = rows
    .map((r) => "(\n" + formatRow(r).map((c) => `  ${c}`).join(",\n") + "\n)")
    .join(",\n");
  const tail = conflict ? `\nON CONFLICT (${conflict}) DO NOTHING` : "";
  return `INSERT INTO ${table}\n${cols}\nVALUES\n${tuples}${tail};\n`;
}

// ── Carga de datos ──────────────────────────────────────────────────────────
const fuerzas = read("fuerzas_armadas.json");
const estados = read("estados.json");
const equipamiento = read("equipamiento.json");
const operativos = read("operativos.json");
const desastres = read("desastres.json");
const noticias = read("noticias.json");
const instalaciones = read("instalaciones.json");
const glosario = read("glosario.json");

const sections = [];

sections.push(
  `-- fuerzas_armadas (${fuerzas.length} registros)`,
  buildInsert(
    "fuerzas_armadas",
    "slug, nombre, siglas, tipo, dependencia,\n   anio_fundacion, mision, efectivos_aprox,\n   presupuesto_aprox, anio_presupuesto,\n   estructura, descripcion, fuente_url, pendiente_verificacion",
    fuerzas,
    (f) => [
      sqlStr(f.slug), sqlStr(f.nombre), sqlStr(f.siglas), sqlStr(f.tipo),
      sqlStr(f.dependencia), sqlNum(f.anio_fundacion), sqlStr(f.mision),
      sqlNum(f.efectivos_aprox), sqlNum(f.presupuesto_aprox),
      sqlNum(f.anio_presupuesto), sqlJson(f.estructura, "'{}'"),
      sqlStr(f.descripcion), sqlStr(f.fuente_url),
      sqlBool(f.pendiente_verificacion),
    ],
    { conflict: "slug" }
  )
);

sections.push(
  `-- estados (${estados.length} registros) — INEGI Censo 2020 + secretarías estatales`,
  buildInsert(
    "estados",
    "slug, nombre, capital, region, poblacion,\n   corporacion_estatal, secretaria_seguridad,\n   efectivos_aprox, presupuesto_seguridad,\n   estructura, descripcion, fuente_url, pendiente_verificacion,\n   litoral, frontera, zona_militar, region_militar,\n   presencia_naval, zona_naval, riesgos_principales",
    estados,
    (e) => [
      sqlStr(e.slug), sqlStr(e.nombre), sqlStr(e.capital), sqlStr(e.region),
      sqlNum(e.poblacion), sqlStr(e.corporacion_estatal),
      sqlStr(e.secretaria_seguridad), sqlNum(e.efectivos_aprox),
      sqlNum(e.presupuesto_seguridad), sqlJson(e.estructura, "'{}'"),
      sqlStr(e.descripcion), sqlStr(e.fuente_url),
      sqlBool(e.pendiente_verificacion),
      sqlStr(e.litoral), sqlStr(e.frontera),
      sqlStr(e.zona_militar), sqlStr(e.region_militar),
      sqlBool(e.presencia_naval ?? false), sqlStr(e.zona_naval),
      sqlJson(e.riesgos_principales, "'[]'"),
    ],
    { conflict: "slug" }
  )
);

sections.push(
  `-- equipamiento (${equipamiento.length} registros)`,
  buildInsert(
    "equipamiento",
    "slug, nombre, categoria, origen_pais, operador,\n   cantidad_aprox, anio, descripcion, imagen_url,\n   imagen_fuente, imagen_licencia,\n   fuente_url, pendiente_verificacion",
    equipamiento,
    (q) => [
      sqlStr(q.slug), sqlStr(q.nombre), sqlStr(q.categoria),
      sqlStr(q.origen_pais), sqlStr(q.operador), sqlNum(q.cantidad_aprox),
      sqlNum(q.anio), sqlStr(q.descripcion), sqlStr(q.imagen_url),
      sqlStr(q.imagen_fuente), sqlStr(q.imagen_licencia),
      sqlStr(q.fuente_url), sqlBool(q.pendiente_verificacion),
    ],
    { conflict: "slug" }
  )
);

sections.push(
  `-- operativos (${operativos.length} registros)`,
  buildInsert(
    "operativos",
    "slug, nombre, fecha_inicio, fecha_fin, tipo,\n   entidades_involucradas, descripcion, resultado,\n   fuente_url, pendiente_verificacion",
    operativos,
    (o) => [
      sqlStr(o.slug), sqlStr(o.nombre), sqlStr(o.fecha_inicio),
      sqlStr(o.fecha_fin), sqlStr(o.tipo),
      sqlJson(o.entidades_involucradas, "'[]'"), sqlStr(o.descripcion),
      sqlStr(o.resultado), sqlStr(o.fuente_url),
      sqlBool(o.pendiente_verificacion),
    ],
    { conflict: "slug" }
  )
);

sections.push(
  `-- desastres (${desastres.length} registros)`,
  buildInsert(
    "desastres",
    "slug, nombre, tipo, fecha, estados_afectados,\n   respuesta_institucional, descripcion,\n   magnitud, muertos_aprox, damnificados_aprox,\n   fuente_url, pendiente_verificacion",
    desastres,
    (d) => [
      sqlStr(d.slug), sqlStr(d.nombre), sqlStr(d.tipo), sqlStr(d.fecha),
      sqlJson(d.estados_afectados, "'[]'"), sqlStr(d.respuesta_institucional),
      sqlStr(d.descripcion),
      sqlStr(d.magnitud), sqlNum(d.muertos_aprox), sqlNum(d.damnificados_aprox),
      sqlStr(d.fuente_url), sqlBool(d.pendiente_verificacion),
    ],
    { conflict: "slug" }
  )
);

sections.push(
  `-- noticias (${noticias.length} boletines oficiales)`,
  buildInsert(
    "noticias",
    "titulo, fuente_oficial, url, fecha,\n   resumen, dependencia, categoria",
    noticias,
    (n) => [
      sqlStr(n.titulo), sqlStr(n.fuente_oficial), sqlStr(n.url),
      sqlStr(n.fecha), sqlStr(n.resumen), sqlStr(n.dependencia),
      sqlStr(n.categoria),
    ]
  )
);

sections.push(
  `-- instalaciones (${instalaciones.length} registros)\n-- Coordenadas aproximadas de dominio público — pendiente_verificacion = true.`,
  buildInsert(
    "instalaciones",
    "nombre, categoria, estado, lat, lng,\n   dependencia, descripcion, fuente_url, pendiente_verificacion",
    instalaciones,
    (i) => [
      sqlStr(i.nombre), sqlStr(i.categoria), sqlStr(i.estado), sqlNum(i.lat),
      sqlNum(i.lng), sqlStr(i.dependencia), sqlStr(i.descripcion),
      sqlStr(i.fuente_url), sqlBool(i.pendiente_verificacion),
    ]
  )
);

sections.push(
  `-- glosario (${glosario.length} términos)`,
  buildInsert(
    "glosario",
    "termino, definicion, siglas, categoria",
    glosario,
    (g) => [sqlStr(g.termino), sqlStr(g.definicion), sqlStr(g.siglas), sqlStr(g.categoria)]
  )
);

// ── Ensamblado final ────────────────────────────────────────────────────────
const header = `-- ============================================================
-- Centinela México — Seed inicial
-- GENERADO AUTOMÁTICAMENTE desde seed/*.json por
-- scripts/generate-seed-sql.mjs — NO editar a mano.
-- Re-generar con: node scripts/generate-seed-sql.mjs
--
-- Datos de acceso público compilados de fuentes oficiales.
-- Registros con pendiente_verificacion = true carecen de cifra
-- oficial pública confirmada en la fecha de edición.
-- ============================================================
`;

const body = sections
  .map((s, i) =>
    i % 2 === 0
      ? `\n-- ============================================================\n${s}\n-- ============================================================`
      : s
  )
  .join("\n");

writeFileSync(join(ROOT, "supabase", "seed.sql"), header + body + "\n", "utf8");

const counts = {
  fuerzas_armadas: fuerzas.length,
  estados: estados.length,
  equipamiento: equipamiento.length,
  operativos: operativos.length,
  desastres: desastres.length,
  noticias: noticias.length,
  instalaciones: instalaciones.length,
  glosario: glosario.length,
};
console.log("seed.sql regenerado. Registros:", JSON.stringify(counts));
