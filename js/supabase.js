// GANTI DENGAN PUNYA KAMU DARI SUPABASE DASHBOARD
const SUPABASE_URL = 'https://wqotezgkxysopdvpxusz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxb3RlemdreHlzb3BkdnB4dXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MTY5NTIsImV4cCI6MjEwNDQ5Mjk1Mn0.FaqsMh8FcWPNNcT8wAa0nUMYsCFCxZOpsx82gjO14ZM';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// LOGIN CUSTOM - Sesuai tabel kamu
const customLogin = async (email, password) => {
  const { data, error } = await db.from('staff')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password) // karena di DB kamu masih 'demo_password'
    .single();
  
  if (error || !data) return { success: false };
  
  // Simpan session manual
  localStorage.setItem('kasir_user', JSON.stringify(data));
  localStorage.setItem('kasir_role', data.role);
  localStorage.setItem('kasir_nama', data.name);
  return { success: true, user: data };
}

const getUser = () => {
  return JSON.parse(localStorage.getItem('kasir_user') || 'null');
}

const logout = () => {
  localStorage.clear();
  window.location.href = './index.html';
}
