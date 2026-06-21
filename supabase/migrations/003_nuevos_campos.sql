-- ============================================================
-- Centinela México — Migración 003
-- Refleja los nuevos campos añadidos en seed/*.json durante la
-- expansión del catálogo de datos (jun 2026).
-- ============================================================

-- ============================================================
-- 1. estados — campos geopolíticos y militares
-- ============================================================
ALTER TABLE estados
  ADD COLUMN IF NOT EXISTS litoral            TEXT,
  ADD COLUMN IF NOT EXISTS frontera           TEXT,
  ADD COLUMN IF NOT EXISTS zona_militar       TEXT,
  ADD COLUMN IF NOT EXISTS region_militar     TEXT,
  ADD COLUMN IF NOT EXISTS presencia_naval    BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS zona_naval         TEXT,
  ADD COLUMN IF NOT EXISTS riesgos_principales JSONB      DEFAULT '[]'::jsonb;

COMMENT ON COLUMN estados.litoral IS
  'Litoral: ''pacifico'', ''golfo'' o NULL (sin litoral).';
COMMENT ON COLUMN estados.frontera IS
  'Frontera terrestre: ''norte'', ''sur'' o NULL.';
COMMENT ON COLUMN estados.zona_militar IS
  'Zona(s) militar(es) SEDENA presentes en el estado (texto libre).';
COMMENT ON COLUMN estados.region_militar IS
  'Región militar a la que pertenece el estado.';
COMMENT ON COLUMN estados.presencia_naval IS
  'true = el estado tiene al menos una zona naval SEMAR activa.';
COMMENT ON COLUMN estados.zona_naval IS
  'Zona(s) naval(es) SEMAR (texto libre), si presencia_naval = true.';
COMMENT ON COLUMN estados.riesgos_principales IS
  'Array de riesgos naturales/civiles identificados por CENAPRED/Protección Civil.';

-- ============================================================
-- 2. desastres — datos cuantitativos de magnitud y afectados
-- ============================================================
ALTER TABLE desastres
  ADD COLUMN IF NOT EXISTS magnitud          TEXT,
  ADD COLUMN IF NOT EXISTS muertos_aprox     INTEGER,
  ADD COLUMN IF NOT EXISTS damnificados_aprox INTEGER;

-- Añadir tipo 'vulcanico' y 'sequia' al CHECK existente
-- (DROP + ADD porque ALTER TABLE … ALTER CONSTRAINT no existe en PG para CHECKs inline)
ALTER TABLE desastres
  DROP CONSTRAINT IF EXISTS desastres_tipo_check;

ALTER TABLE desastres
  ADD CONSTRAINT desastres_tipo_check
    CHECK (tipo IN ('sismo', 'huracan', 'inundacion', 'incendio',
                    'sequia', 'vulcanico', 'otro'));

COMMENT ON COLUMN desastres.magnitud IS
  'Magnitud del evento (escala Richter para sismos, categoría Saffir-Simpson para huracanes, etc.).';
COMMENT ON COLUMN desastres.muertos_aprox IS
  'Número aproximado de fallecidos según cifras oficiales.';
COMMENT ON COLUMN desastres.damnificados_aprox IS
  'Número aproximado de personas damnificadas según cifras oficiales.';

-- ============================================================
-- 3. glosario — categoría temática
-- ============================================================
ALTER TABLE glosario
  ADD COLUMN IF NOT EXISTS categoria TEXT;

COMMENT ON COLUMN glosario.categoria IS
  'Categoría temática del término: institucional, operativo, tecnico, juridico, organico, tactico, estadistico.';

CREATE INDEX IF NOT EXISTS idx_glosario_categoria ON glosario (categoria);

-- ============================================================
-- 4. equipamiento — crédito de imagen
-- ============================================================
ALTER TABLE equipamiento
  ADD COLUMN IF NOT EXISTS imagen_fuente   TEXT,
  ADD COLUMN IF NOT EXISTS imagen_licencia TEXT;

COMMENT ON COLUMN equipamiento.imagen_fuente IS
  'URL de la página de Commons/fuente donde está la imagen (para crédito).';
COMMENT ON COLUMN equipamiento.imagen_licencia IS
  'Licencia de la imagen, e.g. "CC BY-SA", "Public Domain".';

-- ============================================================
-- 5. fuerzas_armadas — ampliar CHECK de tipo
-- ============================================================
ALTER TABLE fuerzas_armadas
  DROP CONSTRAINT IF EXISTS fuerzas_armadas_tipo_check;

ALTER TABLE fuerzas_armadas
  ADD CONSTRAINT fuerzas_armadas_tipo_check
    CHECK (tipo IN ('fuerza_armada', 'fuerza_seguridad',
                    'policia_federal', 'organismo_civil',
                    'dependencia_seguridad'));

-- ============================================================
-- 6. instalaciones — ampliar CHECK de categoria
-- ============================================================
ALTER TABLE instalaciones
  DROP CONSTRAINT IF EXISTS instalaciones_categoria_check;

ALTER TABLE instalaciones
  ADD CONSTRAINT instalaciones_categoria_check
    CHECK (categoria IN (
      'base_militar', 'zona_naval', 'aeropuerto_militar',
      'coordinacion_estatal', 'coordinacion_gn',
      'c4_c5', 'academia', 'hospital_militar',
      'astillero', 'proteccion_civil', 'industria_militar',
      'otro'
    ));
