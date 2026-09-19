// ============================================
// TEMA WARNA — KASIR PRO
// ============================================

const TEMAS = {
  teal:    { primary: '#14b8a6', primaryDark: '#0d9488', accent: '#f97316', name: 'Teal Modern (Default)' },
  merah:   { primary: '#e31e24', primaryDark: '#b8171c', accent: '#f97316', name: 'Merah' },
  purple:  { primary: '#8b5cf6', primaryDark: '#7c3aed', accent: '#ec4899', name: 'Purple' },
  blue:    { primary: '#3b82f6', primaryDark: '#2563eb', accent: '#06b6d4', name: 'Blue' },
  green:   { primary: '#10b981', primaryDark: '#059669', accent: '#f59e0b', name: 'Emerald' },
  orange:  { primary: '#f97316', primaryDark: '#ea580c', accent: '#eab308', name: 'Sunset' },
};

function pilihTema() {
  const keys = Object.keys(TEMAS);
  const list = keys.map((k, i) => `${i+1}. ${TEMAS[k].name}`).join('\n');
  const pilihan = prompt('Pilih tema:\n' + list + '\n\nKetik angka:');
  const idx = parseInt(pilihan) - 1;
  if (idx >= 0 && idx < keys.length) {
    localStorage.setItem('tema', keys[idx]);
    applyTema(keys[idx]);
    if (typeof toast === 'function') toast('Tema diubah ke ' + TEMAS[keys[idx]].name, 'success');
    setTimeout(() => location.reload(), 500);
  }
}

function applyTema(nama) {
  const tema = TEMAS[nama] || TEMAS.teal;
  document.documentElement.style.setProperty('--primary', tema.primary);
  document.documentElement.style.setProperty('--primary-dark', tema.primaryDark);
  document.documentElement.style.setProperty('--accent', tema.accent);
}

applyTema(localStorage.getItem('tema') || 'teal');

function toggleMode() {
  const modeSekarang = localStorage.getItem('mode') || 'light';
  const modeBaru = modeSekarang === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mode', modeBaru);
  applyMode(modeBaru);
  if (typeof toast === 'function') {
    toast(`Mode ${modeBaru === 'dark' ? 'Gelap' : 'Terang'} diaktifkan`, 'info', 1500);
  }
}

function applyMode(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}

applyMode(localStorage.getItem('mode') || 'light');