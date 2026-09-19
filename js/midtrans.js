// ============================================
// MIDTRANS HELPER — QRIS Integration
// ============================================

async function midtransBuatQris(orderId, grossAmount) {
  const { data, error } = await db.functions.invoke('midtrans-charge', {
    body: { order_id: orderId, gross_amount: grossAmount },
  });

  if (error) {
    console.error('Supabase function error:', error);
    throw new Error('Gagal menghubungi server: ' + error.message);
  }

  if (data.error) {
    console.error('Midtrans error:', data);
    throw new Error('Midtrans: ' + (data.error_messages?.join(', ') || data.error));
  }

  const qrAction = data.actions?.find(a => a.name === 'generate-qr-code');
  
  if (!qrAction || !qrAction.url) {
    console.error('Response Midtrans:', data);
    throw new Error('QR Code tidak ditemukan di response Midtrans');
  }

  return {
    qrUrl: qrAction.url,
    orderId: data.order_id || orderId,
    rawResponse: data,
  };
}

function midtransCekStatus(orderId, onPaid, onFailed, onTimeout, intervalMs = 10000, maxCek = 60) {
  let counter = 0;
  let intervalId = null;

  const cek = async () => {
    counter++;
    try {
      const { data: trx, error } = await db
        .from('transactions')
        .select('status, midtrans_status')
        .eq('nomor_trx', orderId)
        .maybeSingle();

      if (error) console.warn('Error cek status:', error.message);

      if (trx?.midtrans_status === 'paid' || trx?.status === 'selesai') {
        clearInterval(intervalId);
        if (onPaid) onPaid(trx);
        return;
      }

      if (trx?.midtrans_status === 'expired' || trx?.midtrans_status === 'failed') {
        clearInterval(intervalId);
        if (onFailed) onFailed(trx);
        return;
      }

      if (counter >= maxCek) {
        clearInterval(intervalId);
        if (onTimeout) onTimeout();
        return;
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  };

  cek();
  intervalId = setInterval(cek, intervalMs);

  return () => clearInterval(intervalId);
}