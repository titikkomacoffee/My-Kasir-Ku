// Tema yang tersedia
const TEMAS = {
  purple: { primary: '#8b5cf6', primaryDark: '#7c3aed', name: 'Purple Neon' },
  blue:   { primary: '#3b82f6', primaryDark: '#2563eb', name: 'Ocean Blue' },
  green:  { primary: '#10b981', primaryDark: '#059669', name: 'Emerald' },
  red:    { primary: '#ef4444', primaryDark: '#dc2626', name: 'Ruby Red' },
  orange: { primary: '#f97316', primaryDark: '#ea580c', name: 'Sunset' },
  pink:   { primary: '#ec4899', primaryDark: '#db2777', name: 'Pink Candy' },
};

function pilihTema() {
  const pilihan = prompt(
    'Pilih tema:\n' + Object.keys(TEMAS).map((k, i) => `${i+1}. ${TEMAS[k].name}`).join('\n') + '\n\nKetik angka:'
  );
  const keys = Object.keys(TEMAS);
  const idx = parseInt(pilihan) - 1;
  if (idx >= 0 && idx < keys.length) {
    const tema = keys[idx];
    localStorage.setItem('tema', tema);
    applyTema(tema);
  }
}

function applyTema(nama) {
  const tema = TEMAS[nama] || TEMAS.purple;
  document.documentElement.style.setProperty('--primary', tema.primary);
  document.documentElement.style.setProperty('--primary-dark', tema.primaryDark);
}

// Auto-load tema tersimpan
applyTema(localStorage.getItem('tema') || 'purple');

// Fungsi logout
async function logout() {
  if (!confirm('Yakin ingin logout?')) return;
  await db.auth.signOut();
  window.location.href = 'index.html';
  }
