import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';   // PUBLIC_* vars live here
import { env as privateEnv } from '$env/dynamic/private'; // non-PUBLIC vars live here

// Dynamic imports so both values are resolved at RUNTIME on Vercel,
// not baked in as undefined at build time like $env/static/* would do.
export const supabaseAdmin = createClient(
    publicEnv.PUBLIC_SUPABASE_URL,
    privateEnv.SUPABASE_SECRET_KEY
);