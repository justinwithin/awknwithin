import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// These values are set during infrastructure setup (/setup-alpacapps-infra)
const SUPABASE_URL = "https://lnqxarwqckpmirpmixcw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucXhhcndxY2twbWlycG1peGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjAyMDIsImV4cCI6MjA4NzY5NjIwMn0.bw8b5XUcEFExlfTrR78Bu4Vdl7Oe_RtjlgvWA7SlQfo";

const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_ANON_KEY.startsWith("YOUR_");

export const supabase: SupabaseClient = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (null as unknown as SupabaseClient);
