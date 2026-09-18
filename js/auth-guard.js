// ============================================
// AUTH GUARD — Penjaga halaman berdasarkan role
// ============================================

// Cache profil user agar tidak query berulang
let __profilCache = null;

/**
 * Ambil profil user yang sedang login
 * Mengembalikan: { id, nama, role, is_active, email } atau null
 */
async function getProfil() {
  if (__profilCache) return __profilCache;

  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;

  const { data: profil } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  __profilCache = {
    id: user.id,
    email: user.email,
    nama: profil?.nama || user.email.split('@')[0],
    role: profil?.role || 'kasir',
    is_active: profil?.is_active !== false
  };
  return __profilCache;
}

/**
 * Guard halaman — panggil di setiap halaman
 * @param {string[]} roleDiizinkan - contoh: ['admin','manager']
 * Kalau kosong / tidak dipanggil → semua role boleh
 */
async function guard(roleDiizinkan = []) {
  const profil = await getProfil();

  // 1. Belum login
  if (!profil) {
    window.location.href = 'index.html';
    return null;
  }

  // 2. Akun nonaktif
  if (!profil.is_active) {
    alert('❌ Akun Anda dinonaktifkan. Hubungi admin.');
    await db.auth.signOut();
    window.location.href = 'index.html';
    return null;
  }

  // 3. Role tidak diizinkan
  if (roleDiizinkan.length > 0 && !roleDiizinkan.includes(profil.role)) {
    alert(`❌ Akses ditolak!\nRole Anda (${profil.role}) tidak boleh membuka halaman ini.`);
    window.location.href = 'dashboard.html';
    return null;
  }

  // 4. Lolos → tampilkan user info di sidebar & filter menu
  renderUserInfo(profil);
  filterMenuByRole(profil.role);

  return profil;
}

/**
 * Tampilkan nama & role di sidebar
 */
function renderUserInfo(profil) {
  const elNama = document.getElementById('sidebarNama');
  const elRole = document.getElementById('sidebarRole');
  if (elNama) elNama.textContent = profil.nama;
  if (elRole) elRole.textContent = profil.role.toUpperCase();
}

/**
 * Sembunyikan menu yang tidak boleh diakses
 */
function filterMenuByRole(role) {
  // Daftar menu & role yang boleh lihat
  const aturanMenu = {
    'menu-produk':    ['admin', 'manager'],
    'menu-laporan':   ['admin', 'manager'],
    'menu-karyawan':  ['admin']
  };

  Object.entries(aturanMenu).forEach(([idMenu, roles]) => {
    const el = document.getElementById(idMenu);
    if (el && !roles.includes(role)) {
      el.style.display = 'none';
    }
  });
}

/**
 * Shortcut: cek apakah user punya role tertentu
 */
async function punyaRole(...roles) {
  const profil = await getProfil();
  return profil && roles.includes(profil.role);
}
