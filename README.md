# 🛒 KASIR PRO — Aplikasi Point of Sale

Aplikasi kasir modern berbasis web untuk UMKM, kafe, restoran, dan toko retail.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-e31e24)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Fitur

- 💰 **POS (Point of Sale)** — transaksi cepat, multi pembayaran (Tunai, QRIS, Piutang)
- 📦 **Produk & Stok** — katalog dengan foto, stok real-time, notifikasi stok menipis
- 📈 **Laporan** — omzet, grafik tren, produk terlaris, export CSV
- 💳 **Piutang** — catat utang pelanggan, cicilan bertahap
- ⏰ **Shift Kasir** — buka/tutup shift, deteksi selisih kas
- 📸 **Absensi** — foto dari kamera + GPS otomatis
- 👥 **Manajemen Karyawan** — 3 role: Admin, Manager, Kasir
- 🎨 **UI Modern** — 6 tema warna + Dark/Light mode
- 🚀 **PWA** — install di HP seperti aplikasi native
- 🔐 **Keamanan** — Supabase Auth + Row Level Security

---

## 🛠️ Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | HTML + CSS + Vanilla JS |
| UI | TailwindCSS |
| Backend | Supabase (PostgreSQL) |
| Deploy | GitHub Pages |
| PWA | Service Worker + Manifest |

---

## 🚀 Cara Deploy

### 1. Setup Supabase

Buat project di [supabase.com](https://supabase.com), lalu jalankan SQL berikut di **SQL Editor**.

#### Buat Tabel

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  nama text not null,
  role text check (role in ('admin','kasir','manager')) default 'kasir',
  is_active boolean default true,
  created_at timestamp default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  icon text,
  created_at timestamp default now()
);

insert into categories (nama, icon) values
('Makanan','🍔'),('Minuman','🥤'),('Bahan Baku','🥬'),('Snack','🍿');

create table products (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  sku text unique,
  harga integer not null default 0,
  harga_modal integer default 0,
  stok integer default 0,
  foto_url text,
  category_id uuid references categories(id),
  is_active boolean default true,
  created_at timestamp default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  nomor_trx text unique not null,
  kasir_id uuid references profiles(id),
  subtotal integer default 0,
  diskon integer default 0,
  total integer default 0,
  metode_bayar text,
  bayar integer default 0,
  kembalian integer default 0,
  status text default 'selesai',
  created_at timestamp default now()
);

create table transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id) on delete cascade,
  product_id uuid references products(id),
  nama_produk text,
  harga integer,
  qty integer,
  subtotal integer,
  created_at timestamp default now()
);

create table piutang (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id),
  nama_pelanggan text not null,
  no_hp text,
  total_utang integer not null,
  total_bayar integer default 0,
  sisa integer,
  status text default 'belum_lunas',
  jatuh_tempo date,
  created_at timestamp default now()
);

create table shifts (
  id uuid primary key default gen_random_uuid(),
  kasir_id uuid references profiles(id),
  waktu_buka timestamp default now(),
  waktu_tutup timestamp,
  kas_awal integer default 0,
  kas_akhir integer,
  total_penjualan integer default 0,
  status text default 'open'
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  foto_url text,
  latitude float,
  longitude float,
  tipe text,
  created_at timestamp default now()
);

create table settings (
  key text primary key,
  value text,
  updated_at timestamp default now()
);

insert into settings (key, value) values
  ('qris_image_url', ''),
  ('nama_toko', 'KASIR PRO'),
  ('alamat_toko', ''),
  ('no_hp_toko', '')
on conflict (key) do nothing;