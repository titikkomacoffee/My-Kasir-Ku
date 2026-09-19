// ============================================
// KONEKSI SUPABASE — KASIR PRO
// GANTI dengan URL & KEY milik Anda!
// ============================================

const SUPABASE_URL = 'https://dcvuzxuxwmcowcnaevgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdnV6eHV4d21jb3djbmFldmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MjcyNDIsImV4cCI6MjEwNTMwMzI0Mn0.svdPVapnSZ4fHTmO2mAt9UUmJKYxJM1Kuie9cjBg3OI';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
