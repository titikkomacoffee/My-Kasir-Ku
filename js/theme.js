// ============================================
// TEMA WARNA + DARK/LIGHT MODE — KASIR PRO
// ============================================

const TEMAS = {
  merah:   { primary: '#e31e24', primaryDark: '#b8171c', name: 'KASIR PRO (Merah)' },
  purple:  { primary: '#8b5cf6', primaryDark: '#7c3aed', name: 'Purple Neon' },
  blue:    { primary: '#3b82f6', primaryDark: '#2563eb', name: 'Ocean Blue' },
  green:   { primary: '#10b981', primaryDark: '#059669', name: 'Emerald' },
  orange:  { primary: '#f97316', primaryDark: '#ea580c', name: 'Sunset' },
  pink:    { primary: '#ec4899', primaryDark: '#db2777', name: 'Pink Candy' },
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
  }
}

function applyTema(nama) {
  const tema = TEMAS[nama] || TEMAS.merah;
  document.documentElement.style.setProperty('--primary', tema.primary);
  document.documentElement.style.setProperty('--primary-dark', tema.primaryDark);
}

applyTema(localStorage.getItem('tema') || 'merah');

function toggleMode() {
  const modeSekarang = localStorage.getItem('mode') || 'dark';
  const modeBaru = modeSekarang === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mode', modeBaru);
  applyMode(modeBaru);
  if (typeof toast === 'function') {
    toast(`Mode ${modeBaru === 'dark' ? 'Gelap' : 'Terang'} diaktifkan`, 'info', 1500);
  }
}

function applyMode(mode) {
  if (mode === 'light') {
    document.body.style.background = '#f1f5f9';
    document.body.style.color = '#0f172a';
    document.body.classList.add('light-mode');
  } else {
    document.body.style.background = '#0f172a';
    document.body.style.color = '#ffffff';
    document.body.classList.remove('light-mode');
  }
}

applyMode(localStorage.getItem('mode') || 'dark');
