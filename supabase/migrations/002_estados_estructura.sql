-- 002_estados_estructura.sql
-- Agrega un campo JSONB flexible a la tabla de estados para detalle adicional
-- de la fuerza estatal (modelo, año de creación, mando, academias, etc.).
-- Refleja el campo `estructura` ya presente en fuerzas_armadas.

ALTER TABLE estados
  ADD COLUMN IF NOT EXISTS estructura JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN estados.estructura IS
  'Detalle adicional de la corporación/fuerza estatal en formato JSON (escalares y listas), renderizado en la ficha del estado.';
