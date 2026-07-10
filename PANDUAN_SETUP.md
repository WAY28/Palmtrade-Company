# 🌴 Panduan Setup PalmTrade Admin

Ikuti langkah-langkah berikut secara berurutan.

---

## LANGKAH 1 — Buat Project di Supabase

1. Buka [https://supabase.com](https://supabase.com) dan login/daftar
2. Klik **"New Project"**
3. Isi nama project: `palmtrade` (bebas)
4. Buat password database yang kuat (simpan!)
5. Pilih region terdekat (Singapore)
6. Klik **"Create new project"** dan tunggu ~1 menit

---

## LANGKAH 2 — Jalankan Schema Database

1. Di Supabase Dashboard, klik **"SQL Editor"** di sidebar kiri
2. Klik **"New query"**
3. Copy seluruh isi file `supabase_schema.sql`
4. Paste ke editor dan klik **"Run"**
5. Pastikan muncul pesan: `✅ Schema berhasil dibuat!`

---

## LANGKAH 3 — Buat Akun Admin

1. Di Supabase Dashboard, klik **"Authentication"** > **"Users"**
2. Klik **"Add user"** > **"Create new user"**
3. Isi:
   - **Email**: `admin@palmtrade.com` (bebas, tapi ingat ini)
   - **Password**: buat password yang kuat
4. Klik **"Create user"**

> ⚠️ Email dan password inilah yang akan dipakai untuk login ke `/admin`

---

## LANGKAH 4 — Ambil API Keys

1. Di Supabase Dashboard, klik **"Settings"** (ikon gear) > **"API"**
2. Catat tiga nilai berikut:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → untuk `SUPABASE_SERVICE_ROLE_KEY`

---

## LANGKAH 5 — Buat File `.env.local`

1. Di folder project, **rename** file `.env.local.example` menjadi `.env.local`
2. Isi dengan nilai dari Langkah 4:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> ⚠️ File `.env.local` sudah ada di `.gitignore` — aman, tidak akan ter-upload ke GitHub

---

## LANGKAH 6 — Jalankan Project

```bash
# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

Buka browser ke: [http://localhost:3000](http://localhost:3000)

---

## LANGKAH 7 — Login ke Admin

1. Buka [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Masukkan email dan password yang dibuat di **Langkah 3**
3. Klik **"Masuk ke Dashboard"**

🎉 Selesai! Admin panel sudah bisa digunakan.

---

## Struktur Halaman Admin

| Halaman | URL | Fungsi |
|---------|-----|--------|
| Dashboard | `/admin` | Statistik & pesan terbaru |
| Products | `/admin/products` | Kelola produk kelapa |
| Gallery | `/admin/gallery` | Kelola foto galeri |
| News | `/admin/news` | Kelola berita & artikel |
| Team | `/admin/team` | Kelola anggota tim |
| Messages | `/admin/contacts` | Lihat pesan dari form kontak |

---

## Deploy ke Vercel (Opsional)

1. Push project ke GitHub
2. Buka [https://vercel.com](https://vercel.com) dan import repo
3. Di bagian **"Environment Variables"**, tambahkan ketiga variabel dari `.env.local`
4. Klik **"Deploy"**

---

## Troubleshooting

**Login gagal / "Email atau password salah"**
→ Pastikan user sudah dibuat di Supabase Authentication (Langkah 3)

**Dashboard kosong / error**
→ Pastikan `.env.local` sudah diisi dengan benar dan schema sudah dijalankan

**Gambar tidak muncul**
→ Pastikan storage bucket `palmtrade-images` sudah dibuat (otomatis oleh schema)
