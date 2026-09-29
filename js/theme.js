const Theme = {
  init: () => {
    const saved = localStorage.getItem('kasirpro_theme') || 'dark';
    document.documentElement.classList.toggle('dark', saved === 'dark');
    document.documentElement.classList.toggle('light', saved === 'light');
    // Untuk Tailwind
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },
  toggle: () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark? 'light' : 'dark';
    localStorage.setItem('kasirpro_theme', newTheme);
    Theme.init();
    UI.toast(`Tema ${newTheme} aktif`);
  }
};
Theme.init();

// Pakai di pengaturan.html -> <button onclick="Theme.toggle()">Ganti Tema</button>
