// ============================================
// UI HELPER — Toast, Confirm, Loading
// ============================================

/**
 * Toast notification modern
 * @param {string} pesan - pesan yang ditampilkan
 * @param {string} tipe - 'success' | 'error' | 'info' | 'warning'
 * @param {number} durasi - milidetik (default 3000)
 */
function toast(pesan, tipe = 'info', durasi = 3000) {
  // Hapus toast lama kalau ada
  const existing = document.getElementById('__toastContainer');
  if (!existing) {
    const container = document.createElement('div');
    container.id = '__toastContainer';
    container.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 99999;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const warna = {
    success: { bg: '#10b981', icon: '✅' },
    error:   { bg: '#ef4444', icon: '❌' },
    warning: { bg: '#f59e0b', icon: '⚠️' },
    info:    { bg: '#8b5cf6', icon: 'ℹ️' }
  }[tipe] || { bg: '#64748b', icon: '💬' };

  const el = document.createElement('div');
  el.style.cssText = `
    background: ${warna.bg};
    color: white;
    padding: 14px 20px;
    border-radius: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    display: flex; align-items: center; gap: 10px;
    min-width: 260px; max-width: 380px;
    pointer-events: auto;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  `;
  el.innerHTML = `<span style="font-size:18px">${warna.icon}</span><span>${pesan}</span>`;

  document.getElementById('__toastContainer').appendChild(el);

  // Animasi masuk
  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)';
    el.style.opacity = '1';
  });

  // Auto hilang
  setTimeout(() => {
    el.style.transform = 'translateX(400px)';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, durasi);
}

/**
 * Konfirmasi modern (ganti confirm() biasa)
 * @returns Promise<boolean>
 */
function konfirmasi(pesan, judul = 'Konfirmasi') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px); z-index: 99998;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; opacity: 0; transition: opacity 0.2s;
    `;
    overlay.innerHTML = `
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 20px;
                  padding: 24px; max-width: 400px; width: 100%; font-family: 'Inter', sans-serif;
                  color: white; transform: scale(0.9); transition: transform 0.2s;">
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">${judul}</h3>
        <p style="color: #94a3b8; margin-bottom: 20px; line-height: 1.5;">${pesan}</p>
        <div style="display: flex; gap: 10px;">
          <button id="__confirmNo" style="flex:1; padding: 12px; border-radius: 12px;
                  background: #334155; color: white; font-weight: 700; border: none;
                  cursor: pointer; font-size: 14px;">Batal</button>
          <button id="__confirmYes" style="flex:1; padding: 12px; border-radius: 12px;
                  background: linear-gradient(135deg,#8b5cf6,#ec4899); color: white;
                  font-weight: 700; border: none; cursor: pointer; font-size: 14px;">Ya, Lanjutkan</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.querySelector('div').style.transform = 'scale(1)';
    });

    const tutup = (hasil) => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 200);
      resolve(hasil);
    };

    overlay.querySelector('#__confirmYes').onclick = () => tutup(true);
    overlay.querySelector('#__confirmNo').onclick = () => tutup(false);
    overlay.onclick = (e) => { if (e.target === overlay) tutup(false); };
  });
}

/**
 * Loading skeleton
 */
function showLoading(targetSelector, baris = 3) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = Array(baris).fill(0).map(() => `
    <div style="background: #1e293b; border-radius: 16px; padding: 20px;
                margin-bottom: 12px; animation: __skeletonPulse 1.5s infinite;">
      <div style="background: #334155; height: 16px; width: 40%; border-radius: 8px; margin-bottom: 12px;"></div>
      <div style="background: #334155; height: 14px; width: 70%; border-radius: 8px;"></div>
    </div>
  `).join('');

  if (!document.getElementById('__skeletonStyle')) {
    const style = document.createElement('style');
    style.id = '__skeletonStyle';
    style.textContent = `
      @keyframes __skeletonPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }
}
