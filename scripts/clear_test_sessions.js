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
    await client.connect();
    console.log("Connected. Clearing test recorded sessions from database...");
    const res = await client.query("DELETE FROM public.recorded_sessions WHERE id LIKE 'REC-%'");
    console.log(`Deleted ${res.rowCount} test sessions. Table is now clean!`);
  } catch (err) {
    console.error("Error clearing sessions:", err);
  } finally {
    await client.end();
  }
}

run();
