import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// These values are set during infrastructure setup (/setup-alpacapps-infra)
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const isConfigured =
  SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

export const supabase: SupabaseClient = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (null as unknown as SupabaseClient);
