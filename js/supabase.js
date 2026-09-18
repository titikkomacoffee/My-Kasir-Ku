// GANTI dengan URL & KEY milik Anda dari Supabase Settings → API
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';

// Pakai CDN supabase (dimuat di HTML)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
