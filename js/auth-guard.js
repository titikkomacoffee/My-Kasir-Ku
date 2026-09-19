// ============================================
// AUTH GUARD — dengan cache
// ============================================

async function getProfil() {
  const cache = ambilCacheProfil();
  if (cache) return cache;

  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;

  const { data: profil } = await db
    .from('profiles')
    .select('id, nama, role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  const hasil = {
    id: user.id,
    email: user.email,
    nama: profil?.nama || user.email.split('@')[0],
    role: profil?.role || 'kasir',
    is_active: profil?.is_active !== false
  };

  simpanCacheProfil(hasil);
  return hasil;
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
    hapusCacheProfil();
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
      kasir: '#14b8a6'
    };
    elRole.style.color = warnaRole[profil.role] || '#14b8a6';
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
    if (el) {
      el.style.display = roles.includes(role) ? '' : 'none';
    }
  });
}

async function punyaRole(...roles) {
  const profil = await getProfil();
  return profil && roles.includes(profil.role);
}