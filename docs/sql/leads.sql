-- Contact form submissions from /contact. Applied manually in the Neon console or via psql.
CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  phone       TEXT,
  topic       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
