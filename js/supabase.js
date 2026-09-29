// GANTI DENGAN PUNYA KAMU DARI SUPABASE DASHBOARD
const SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper global
const getUser = async () => {
  const { data } = await db.auth.getSession();
  return data.session?.user || null;
}
