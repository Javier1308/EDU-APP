-- Perfiles de usuario (extensión de Supabase Auth)
CREATE TABLE user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  institution TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Fuentes pedagógicas base
CREATE TABLE sources (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'document',
  content      TEXT,
  file_url     TEXT,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Materiales generados
CREATE TABLE materials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  material_type   TEXT NOT NULL,
  education_level TEXT NOT NULL,
  grade           TEXT[] NOT NULL,
  subject         TEXT NOT NULL,
  topic           TEXT NOT NULL,
  competence      TEXT,
  capacities      TEXT[],
  performances    TEXT[],
  additional_info TEXT,
  content         JSONB NOT NULL,
  status          TEXT DEFAULT 'draft',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Trazabilidad fuente → material
CREATE TABLE source_validations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id          UUID REFERENCES materials(id) ON DELETE CASCADE,
  source_id            UUID REFERENCES sources(id) ON DELETE SET NULL,
  relation_level       TEXT,
  validity_reason      TEXT,
  usage_recommendation TEXT,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- Evaluaciones
CREATE TABLE evaluations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  material_id     UUID REFERENCES materials(id) ON DELETE SET NULL,
  input_text      TEXT,
  file_url        TEXT,
  material_type   TEXT,
  education_level TEXT,
  grade           TEXT,
  subject         TEXT,
  result          JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS: cada usuario solo ve sus propios datos
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_own" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "materials_own" ON materials
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "evaluations_own" ON evaluations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "source_validations_own" ON source_validations
  FOR ALL USING (
    material_id IN (SELECT id FROM materials WHERE user_id = auth.uid())
  );

CREATE POLICY "sources_read_all" ON sources
  FOR SELECT USING (true);

CREATE POLICY "sources_insert_authenticated" ON sources
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
