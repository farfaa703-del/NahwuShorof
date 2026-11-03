# Nahwu Sharaf Academy

Aplikasi full-stack pembelajaran Nahwu dan Sharaf dasar berbasis Next.js dan Supabase.

## Fitur MVP

- Halaman publik untuk materi Nahwu dan Sharaf.
- Detail materi dengan dukungan teks Arab RTL.
- Tabel pengantar tashrif lughawi 14 dhamir.
- Registrasi, login, dan logout menggunakan Supabase Auth.
- Dashboard siswa untuk melihat ringkasan progres dan riwayat latihan.
- Kuis pilihan ganda dengan pemeriksaan jawaban di server.
- Dashboard admin untuk membuat, mengedit, menghapus, dan menerbitkan materi serta kuis.
- PostgreSQL dan Row Level Security (RLS) melalui Supabase.

## Teknologi

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth dan PostgreSQL
- GitHub dan Vercel

## 1. Persiapan

Pastikan Node.js 20.9 atau lebih baru sudah terpasang.

Buat project baru di [Supabase](https://supabase.com/), lalu buka **Project Settings → API**. Salin Project URL dan anon/public key.

## 2. Instalasi lokal

```bash
npm install
```

Salin `.env.example` menjadi `.env.local`, lalu isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Jangan memasukkan `service_role` key ke variabel `NEXT_PUBLIC_*` atau ke source code frontend.

## 3. Siapkan database

1. Buka Supabase Dashboard.
2. Masuk ke SQL Editor.
3. Buka file `supabase/schema.sql`.
4. Jalankan seluruh SQL.
5. Periksa tabel `profiles`, `lessons`, `quizzes`, dan `quiz_attempts`.

File SQL membuat tabel, trigger profil otomatis, policy RLS, empat materi contoh, dan dua kuis contoh.

## 4. Jalankan aplikasi

```bash
npm run dev
```

Buka http://localhost:3000.

Periksa tipe TypeScript dan build produksi:

```bash
npm run typecheck
npm run build
```

## 5. Membuat akun admin

1. Jalankan aplikasi.
2. Daftar akun melalui halaman `/register`.
3. Jika Supabase meminta konfirmasi email, buka email dan konfirmasi akun.
4. Buka Supabase → SQL Editor.
5. Jalankan SQL berikut dengan email akun yang ingin dijadikan admin:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'admin@email.com'
);
```

6. Masuk kembali ke aplikasi. Tombol Panel Admin akan muncul di dashboard.

Registrasi publik selalu membuat role `student`. Jangan memberi akses admin melalui form registrasi publik.

## 6. Deploy ke Vercel

1. Push project ini ke repository GitHub.
2. Buka https://vercel.com dan import repository.
3. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Di Supabase Authentication → URL Configuration, masukkan URL produksi Vercel ke Site URL dan tambahkan URL callback/redirect yang sesuai.

## Struktur penting

```text
src/
  app/
    admin/            # panel admin, pengelolaan materi, dan kuis
    auth/             # server actions autentikasi
    dashboard/        # dashboard siswa
    kuis/             # kuis dan penyimpanan hasil
    materi/           # detail materi
    nahwu/            # daftar materi Nahwu
    sharaf/            # daftar materi Sharaf
    tashrif/          # tabel tashrif
  components/         # komponen UI
  lib/
    data.ts           # query materi
    supabase/         # Supabase client
supabase/
  schema.sql          # skema database, RLS, seed data
```

## Catatan pengembangan

- Konten contoh merupakan materi pengantar dan perlu ditinjau oleh pengajar Bahasa Arab sebelum digunakan sebagai bahan ajar resmi.
- Tabel tashrif yang disediakan adalah ilustrasi pola pengantar. Validasi bentuk kata, terutama fi'il mu'tal dan variasi wazan, sebelum digunakan untuk penilaian.
- Panel admin menyediakan CRUD kuis dengan empat opsi jawaban per soal. Kunci jawaban dinilai melalui fungsi database agar siswa tidak dapat mengirim skor buatan dari browser.
- Fitur pembayaran, kelas berbayar, sertifikat, dan forum belum termasuk dalam versi awal.
- RLS wajib tetap aktif. Jangan menaruh Supabase service role key di browser.
