// ============================================
// UI HELPER — Toast, Confirm, Loading, Sidebar
// ============================================

function toast(pesan, tipe = 'info', durasi = 3000) {
  const existing = document.getElementById('__toastContainer');
  if (!existing) {
    const container = document.createElement('div');
    container.id = '__toastContainer';
    container.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 99999;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none; max-width: calc(100vw - 40px);
    `;
    document.body.appendChild(container);
  }

  const warna = {
    success: { bg: '#14b8a6', icon: '✅' },
    error:   { bg: '#ef4444', icon: '❌' },
    warning: { bg: '#f59e0b', icon: '⚠️' },
    info:    { bg: '#3b82f6', icon: 'ℹ️' }
  }[tipe] || { bg: '#64748b', icon: '💬' };

  const el = document.createElement('div');
  el.style.cssText = `
    background: ${warna.bg};
    color: white;
    padding: 14px 20px;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    display: flex; align-items: center; gap: 10px;
    min-width: 240px; max-width: 380px;
    pointer-events: auto;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  `;
  el.innerHTML = `<span style="font-size:18px">${warna.icon}</span><span>${pesan}</span>`;

  document.getElementById('__toastContainer').appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)';
    el.style.opacity = '1';
  });

  setTimeout(() => {
    el.style.transform = 'translateX(400px)';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, durasi);
}

function konfirmasi(pesan, judul = 'Konfirmasi') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px); z-index: 99998;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; opacity: 0; transition: opacity 0.2s;
    `;
    overlay.innerHTML = `
      <div style="background: white; border-radius: 24px;
                  padding: 28px; max-width: 400px; width: 100%; font-family: 'Inter', sans-serif;
                  color: #1e293b; transform: scale(0.9); transition: transform 0.2s;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">${judul}</h3>
        <p style="color: #64748b; margin-bottom: 24px; line-height: 1.5; font-size: 14px;">${pesan}</p>
        <div style="display: flex; gap: 10px;">
          <button id="__confirmNo" style="flex:1; padding: 14px; border-radius: 14px;
                  background: #f1f5f9; color: #334155; font-weight: 700; border: none;
                  cursor: pointer; font-size: 14px;">Batal</button>
          <button id="__confirmYes" style="flex:1; padding: 14px; border-radius: 14px;
                  background: #14b8a6; color: white;
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

function showLoading(targetSelector, baris = 3) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = Array(baris).fill(0).map(() => `
    <div style="background: white; border-radius: 20px; padding: 20px;
                margin-bottom: 12px; animation: __skeletonPulse 1.5s infinite;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background: #e2e8f0; height: 16px; width: 40%; border-radius: 8px; margin-bottom: 12px;"></div>
      <div style="background: #e2e8f0; height: 14px; width: 70%; border-radius: 8px;"></div>
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

function showGlobalLoading(pesan = 'Memuat...') {
  let el = document.getElementById('__globalLoading');
  if (!el) {
    el = document.createElement('div');
    el.id = '__globalLoading';
    el.style.cssText = `
      position: fixed; inset: 0; background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(6px); z-index: 99997;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 16px; font-family: 'Inter', sans-serif;
      opacity: 0; transition: opacity 0.2s;
    `;
    el.innerHTML = `
      <div style="width: 60px; height: 60px; border: 4px solid rgba(20,184,166,0.2);
                  border-top-color: #14b8a6; border-radius: 50%;
                  animation: __spinLoading 1s linear infinite;"></div>
      <p style="font-size: 14px; color: #64748b; font-weight: 600;">${pesan}</p>
    `;
    document.body.appendChild(el);

    if (!document.getElementById('__spinStyle')) {
      const style = document.createElement('style');
      style.id = '__spinStyle';
      style.textContent = `
        @keyframes __spinLoading { to { transform: rotate(360deg); } }
      `;
      document.head.appendChild(style);
    }
  } else {
    const p = el.querySelector('p');
    if (p) p.textContent = pesan;
  }
  requestAnimationFrame(() => el.style.opacity = '1');
}

function hideGlobalLoading() {
  const el = document.getElementById('__globalLoading');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 200);
  }
}

async function logout() {
  if (!await konfirmasi('Yakin ingin logout?', 'Logout')) return;
  hapusCacheProfil();
  await db.auth.signOut();
  window.location.href = 'index.html';
}

function toggleSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('sidebar-open');
  if (overlay) overlay.classList.toggle('hidden');
}

function closeSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('sidebar-open');
  if (overlay) overlay.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  if (window.innerWidth < 1024) {
    const link = e.target.closest('.menu-item');
    if (link && link.tagName === 'A') closeSidebar();
  }
});