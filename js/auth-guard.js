// ============================================
// AUTH GUARD — Penjaga halaman berdasarkan role
// ============================================

let __profilCache = null;

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

async function guard(roleDiizinkan = []) {
  const profil = await getProfil();

  if (!profil) {
    window.location.href = 'index.html';
    return null;
  }

  if (!profil.is_active) {
    alert('❌ Akun Anda dinonaktifkan. Hubungi admin.');
    await db.auth.signOut();
    window.location.href = 'index.html';
    return null;
  }

  if (roleDiizinkan.length > 0 && !roleDiizinkan.includes(profil.role)) {
    alert(`❌ Akses ditolak!\nRole Anda (${profil.role}) tidak boleh membuka halaman ini.`);
    window.location.href = 'dashboard.html';
    return null;
  }

  renderUserInfo(profil);
  filterMenuByRole(profil.role);

  return profil;
}

function renderUserInfo(profil) {
  const elNama = document.getElementById('sidebarNama');
  const elRole = document.getElementById('sidebarRole');
  if (elNama) elNama.textContent = profil.nama;
  if (elRole) {
    elRole.textContent = profil.role.toUpperCase();
    const warnaRole = {
      admin: '#ef4444',
      manager: '#f59e0b',
      kasir: '#e31e24'
    };
    elRole.style.color = warnaRole[profil.role] || '#e31e24';
  }
}

function filterMenuByRole(role) {
  const aturanMenu = {
    'menu-produk':     ['admin', 'manager'],
    'menu-laporan':    ['admin', 'manager'],
    'menu-karyawan':   ['admin'],
    'menu-pengaturan': ['admin']
  };

  Object.entries(aturanMenu).forEach(([idMenu, roles]) => {
    const el = document.getElementById(idMenu);
    if (el && !roles.includes(role)) {
      el.style.display = 'none';
    }
  });
}

async function punyaRole(...roles) {
  const profil = await getProfil();
  return profil && roles.includes(profil.role);
    }
