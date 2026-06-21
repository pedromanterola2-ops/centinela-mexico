-- ============================================================
-- Centinela México — Esquema inicial
-- Migración: 001_initial_schema
-- Todas las tablas usan UUID como PK y TIMESTAMPTZ para auditoría.
-- RLS habilitado pero sin políticas activas; activar en Fase de Auth.
-- ============================================================

-- Extensión para generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. fuerzas_armadas
-- Fuentes: SEDENA (gob.mx/sedena), SEMAR (gob.mx/semar),
--          Guardia Nacional (gob.mx/guardianacional), DOF
-- ============================================================
CREATE TABLE IF NOT EXISTS fuerzas_armadas (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   TEXT        UNIQUE NOT NULL,
  nombre                 TEXT        NOT NULL,
  siglas                 TEXT,
  tipo                   TEXT        NOT NULL CHECK (tipo IN (
                           'fuerza_armada', 'fuerza_seguridad',
                           'policia_federal', 'organismo_civil')),
  dependencia            TEXT,
  anio_fundacion         INTEGER,
  mision                 TEXT,
  efectivos_aprox        INTEGER,
  presupuesto_aprox      NUMERIC(18, 2),
  anio_presupuesto       INTEGER,
  estructura             JSONB       DEFAULT '{}',
  descripcion            TEXT,
  fuente_url             TEXT,
  pendiente_verificacion BOOLEAN     DEFAULT false,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fuerzas_armadas_slug ON fuerzas_armadas (slug);
CREATE INDEX IF NOT EXISTS idx_fuerzas_armadas_tipo ON fuerzas_armadas (tipo);

COMMENT ON TABLE fuerzas_armadas IS
  'Fuerzas armadas y de seguridad de México. Fuentes: SEDENA, SEMAR, DOF.';
COMMENT ON COLUMN fuerzas_armadas.pendiente_verificacion IS
  'true = dato sin fuente oficial confirmada. Nunca mostrar como definitivo.';

-- ============================================================
-- 2. estados
-- Fuentes: INEGI, secretarías estatales de seguridad pública,
--          Plataforma Nacional de Transparencia
-- ============================================================
CREATE TABLE IF NOT EXISTS estados (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   TEXT        UNIQUE NOT NULL,
  nombre                 TEXT        NOT NULL,
  capital                TEXT,
  region                 TEXT,
  poblacion              INTEGER,
  corporacion_estatal    TEXT,
  secretaria_seguridad   TEXT,
  efectivos_aprox        INTEGER,
  presupuesto_seguridad  NUMERIC(18, 2),
  descripcion            TEXT,
  fuente_url             TEXT,
  pendiente_verificacion BOOLEAN     DEFAULT true,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estados_slug   ON estados (slug);
CREATE INDEX IF NOT EXISTS idx_estados_region ON estados (region);

COMMENT ON TABLE estados IS
  'Entidades federativas: corporaciones estatales y datos de seguridad pública.';

-- ============================================================
-- 3. equipamiento
-- Fuentes: SEDENA/SEMAR (comunicados y adquisiciones en DOF),
--          INEGI, informes anuales de dependencias
-- ============================================================
CREATE TABLE IF NOT EXISTS equipamiento (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   TEXT        UNIQUE NOT NULL,
  nombre                 TEXT        NOT NULL,
  categoria              TEXT        NOT NULL CHECK (categoria IN (
                           'terrestre', 'aereo', 'naval', 'individual', 'otro')),
  origen_pais            TEXT,
  operador               TEXT,
  cantidad_aprox         INTEGER,
  anio                   INTEGER,
  descripcion            TEXT,
  imagen_url             TEXT,
  fuente_url             TEXT,
  pendiente_verificacion BOOLEAN     DEFAULT true,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipamiento_slug      ON equipamiento (slug);
CREATE INDEX IF NOT EXISTS idx_equipamiento_categoria ON equipamiento (categoria);
CREATE INDEX IF NOT EXISTS idx_equipamiento_operador  ON equipamiento (operador);

COMMENT ON TABLE equipamiento IS
  'Inventario de equipamiento militar y policial por categoría y operador.';

-- ============================================================
-- 4. operativos
-- Fuentes: DOF, comunicados SEDENA/SEMAR/GN, informes al Congreso
-- ============================================================
CREATE TABLE IF NOT EXISTS operativos (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     TEXT        UNIQUE NOT NULL,
  nombre                   TEXT        NOT NULL,
  fecha_inicio             DATE,
  fecha_fin                DATE,
  tipo                     TEXT        CHECK (tipo IN (
                             'seguridad', 'desastre', 'ceremonial',
                             'humanitario', 'mixto')),
  entidades_involucradas   JSONB       DEFAULT '[]',
  descripcion              TEXT,
  resultado                TEXT,
  fuente_url               TEXT,
  pendiente_verificacion   BOOLEAN     DEFAULT true,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operativos_slug         ON operativos (slug);
CREATE INDEX IF NOT EXISTS idx_operativos_tipo         ON operativos (tipo);
CREATE INDEX IF NOT EXISTS idx_operativos_fecha_inicio ON operativos (fecha_inicio);

COMMENT ON TABLE operativos IS
  'Operativos militares, de seguridad y de auxilio en desastres.';

-- ============================================================
-- 5. desastres
-- Fuentes: CENAPRED (cenapred.gob.mx), CNPC (cnpc.gob.mx),
--          SEDENA (informes DN-III-E), DOF decretos de emergencia
-- ============================================================
CREATE TABLE IF NOT EXISTS desastres (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     TEXT        UNIQUE NOT NULL,
  nombre                   TEXT        NOT NULL,
  tipo                     TEXT        CHECK (tipo IN (
                             'sismo', 'huracan', 'inundacion',
                             'incendio', 'sequia', 'otro')),
  fecha                    DATE,
  estados_afectados        JSONB       DEFAULT '[]',
  respuesta_institucional  TEXT,
  descripcion              TEXT,
  fuente_url               TEXT,
  pendiente_verificacion   BOOLEAN     DEFAULT false,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_desastres_slug  ON desastres (slug);
CREATE INDEX IF NOT EXISTS idx_desastres_tipo  ON desastres (tipo);
CREATE INDEX IF NOT EXISTS idx_desastres_fecha ON desastres (fecha);

COMMENT ON TABLE desastres IS
  'Desastres naturales con activación de Planes DN-III-E / Marina / PC.';

-- ============================================================
-- 6. noticias
-- Fuentes: boletines de prensa oficiales de cada dependencia
-- ============================================================
CREATE TABLE IF NOT EXISTS noticias (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          TEXT        NOT NULL,
  fuente_oficial  TEXT,
  url             TEXT,
  fecha           DATE,
  resumen         TEXT,
  dependencia     TEXT,
  categoria       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_noticias_fecha       ON noticias (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_dependencia ON noticias (dependencia);
CREATE INDEX IF NOT EXISTS idx_noticias_categoria   ON noticias (categoria);

COMMENT ON TABLE noticias IS
  'Boletines de prensa y comunicados de fuentes oficiales.';

-- ============================================================
-- 7. instalaciones
-- Fuentes: SEDENA, SEMAR, INEGI, datos geoespaciales públicos
-- Coordenadas aproximadas — pendiente_verificacion = true por defecto
-- ============================================================
CREATE TABLE IF NOT EXISTS instalaciones (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre                 TEXT        NOT NULL,
  categoria              TEXT        NOT NULL CHECK (categoria IN (
                           'base_militar', 'zona_naval',
                           'aeropuerto_militar', 'coordinacion_estatal',
                           'c4_c5', 'academia', 'hospital_militar', 'otro')),
  estado                 TEXT,
  lat                    NUMERIC(10, 7),
  lng                    NUMERIC(10, 7),
  dependencia            TEXT,
  descripcion            TEXT,
  fuente_url             TEXT,
  pendiente_verificacion BOOLEAN     DEFAULT true,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instalaciones_categoria  ON instalaciones (categoria);
CREATE INDEX IF NOT EXISTS idx_instalaciones_estado     ON instalaciones (estado);
CREATE INDEX IF NOT EXISTS idx_instalaciones_dependencia ON instalaciones (dependencia);

COMMENT ON TABLE instalaciones IS
  'Instalaciones militares, navales, académicas y de C4/C5. Coords. aproximadas.';

-- ============================================================
-- 8. glosario
-- ============================================================
CREATE TABLE IF NOT EXISTS glosario (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  termino    TEXT        NOT NULL,
  definicion TEXT,
  siglas     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_glosario_siglas  ON glosario (siglas);
CREATE INDEX IF NOT EXISTS idx_glosario_termino ON glosario (lower(termino));

COMMENT ON TABLE glosario IS
  'Glosario de términos, siglas y acrónimos del ámbito de seguridad y defensa.';

-- ============================================================
-- RLS — habilitado, sin políticas activas (lectura pública en Fase de Auth)
-- ============================================================
ALTER TABLE fuerzas_armadas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados               ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamiento          ENABLE ROW LEVEL SECURITY;
ALTER TABLE operativos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE desastres             ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias              ENABLE ROW LEVEL SECURITY;
ALTER TABLE instalaciones         ENABLE ROW LEVEL SECURITY;
ALTER TABLE glosario              ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (anon puede leer todo)
CREATE POLICY "lectura_publica" ON fuerzas_armadas FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON estados          FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON equipamiento     FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON operativos       FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON desastres        FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON noticias         FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON instalaciones    FOR SELECT USING (true);
CREATE POLICY "lectura_publica" ON glosario         FOR SELECT USING (true);

-- ============================================================
-- Función helper: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON fuerzas_armadas
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON estados
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON equipamiento
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON operativos
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON desastres
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON instalaciones
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
