import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fvfgjmhygrnylzagxubs.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_roP7ZFuQeXmNv61MULia8Q_tVoBqCbq";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZmdqbWh5Z3JueWx6YWd4dWJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDAyNDc1NywiZXhwIjoyMTA1NjAwNzU3fQ.vN3dvH6904haCDfOzGPlh23v58-QLnfEsOybf6doTfM";

/**
 * Standard Supabase client (used for client-side and public queries)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Admin Supabase client (used in Server Actions and API routes to bypass RLS)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
