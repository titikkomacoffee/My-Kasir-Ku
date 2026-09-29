(async () => {
  const session = await db.auth.getSession();
  const user = session.data.session;
  const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === './';

  if (!user &&!isLoginPage) {
    // Belum login tapi mau masuk dashboard
    window.location.href = './index.html';
    return;
  }

  if (user && isLoginPage) {
    // Sudah login tapi masih di halaman login
    window.location.href = './dashboard.html';
    return;
  }

  if (user) {
    // Cek role karyawan (optional)
    const { data: profile } = await db.from('karyawan').select('role, nama').eq('id_auth', user.user.id).single();
    if (profile) {
      localStorage.setItem('kasir_role', profile.role);
      localStorage.setItem('kasir_nama', profile.nama);
      // Contoh: karyawan kasir tidak boleh buka laporan
      if (profile.role === 'kasir' && window.location.pathname.includes('laporan.html')) {
        window.location.href = './kasir.html';
      }
    }
  }
})();

const logout = async () => {
  await db.auth.signOut();
  localStorage.clear();
  window.location.href = './index.html';
}
