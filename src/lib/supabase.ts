import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Returns a configured client, or null if keys are placeholders
export const supabase =
    supabaseUrl && !supabaseUrl.includes("your_") && supabaseAnonKey && !supabaseAnonKey.includes("your_")
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

export const isSupabaseReady = !!supabase;
