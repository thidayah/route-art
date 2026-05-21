import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null when credentials are not yet configured — components must guard against this
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
