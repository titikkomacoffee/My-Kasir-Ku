const UI = {
  toast: (msg, type = 'success') => {
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'fixed top-4 right-4 z-[9999] space-y-2';
      document.body.appendChild(el);
    }
    const color = type === 'success'? 'bg-green-600' : type === 'error'? 'bg-red-600' : 'bg-slate-800';
    const toastEl = document.createElement('div');
    toastEl.className = `${color} text-white px-4 py-3 rounded-lg shadow-lg text-sm animate-pulse`;
    toastEl.innerText = msg;
    el.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
  },

  loading: (show) => {
    let loader = document.getElementById('global-loader');
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]';
        loader.innerHTML = '<div class="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>';
        document.body.appendChild(loader);
      }
    } else {
      loader?.remove();
    }
  },

  rupiah: (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  },

  tanggal: (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  }
};
