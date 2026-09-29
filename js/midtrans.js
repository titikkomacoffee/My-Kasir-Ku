// Pastikan kamu sudah pasang Snap Midtrans di HTML
// <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-xxxxxxxx"></script>

const Midtrans = {
  // Panggil backend Supabase Edge Function untuk buat token
  createTransaction: async (orderId, amount, customerName) => {
    UI.loading(true);
    try {
      // Kamu harus buat Edge Function bernama 'create-midtrans-token'
      const { data, error } = await db.functions.invoke('create-midtrans-token', {
        body: { order_id: orderId, gross_amount: amount, customer_name: customerName }
      });
      if (error) throw error;
      return data.token;
    } catch (err) {
      UI.toast('Gagal buat transaksi: ' + err.message, 'error');
      return null;
    } finally {
      UI.loading(false);
    }
  },

  pay: (snapToken, onSuccess) => {
    if (!window.snap) {
      UI.toast('Midtrans belum siap', 'error');
      return;
    }
    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        UI.toast('Pembayaran Berhasil!');
        if (onSuccess) onSuccess(result);
      },
      onPending: function (result) {
        UI.toast('Menunggu pembayaran', 'info');
      },
      onError: function (result) {
        UI.toast('Pembayaran gagal', 'error');
      },
      onClose: function () {
        UI.toast('Popup pembayaran ditutup', 'info');
      }
    });
  }
};
