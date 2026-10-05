const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres.fvfgjmhygrnylzagxubs:xIsfuw-pawqog-2nomra@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Connecting to Supabase PostgreSQL database...");
    await client.connect();
    console.log("Connected successfully. Adding columns to recorded_sessions...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.recorded_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        instructor TEXT NOT NULL,
        duration TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        thumbnail_url TEXT,
        video_url TEXT,
        description TEXT,
        views INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      ALTER TABLE public.recorded_sessions ADD COLUMN IF NOT EXISTS target_track TEXT DEFAULT 'both';
      ALTER TABLE public.recorded_sessions ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;
      ALTER TABLE public.recorded_sessions ADD COLUMN IF NOT EXISTS instructor_role TEXT DEFAULT 'Senior Fashion Faculty';
      ALTER TABLE public.recorded_sessions ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'Secretary Desk';
      ALTER TABLE public.recorded_sessions ADD COLUMN IF NOT EXISTS notes TEXT;

      CREATE INDEX IF NOT EXISTS idx_recorded_sessions_track ON public.recorded_sessions(target_track);
    `);

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

run();
