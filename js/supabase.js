// GANTI DENGAN PUNYA KAMU DARI SUPABASE DASHBOARD
const SUPABASE_URL = 'https://wqotezgkxysopdvpxusz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxb3RlemdreHlzb3BkdnB4dXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MTY5NTIsImV4cCI6MjEwNDQ5Mjk1Mn0.FaqsMh8FcWPNNcT8wAa0nUMYsCFCxZOpsx82gjO14ZM';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper global
const getUser = async () => {
  const { data } = await db.auth.getSession();
  return data.session?.user || null;
}
