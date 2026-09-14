# SiMika - Sistem Rekapitulasi Lomba Pramuka Juara Online

SiMika adalah platform web terpadu yang dirancang khusus untuk memodernisasi, mengolah, dan menyajikan hasil rekapitulasi nilai perlombaan Pramuka secara transparan, akurat, dan real-time.

## 🌟 Fitur Utama
- **Crimson Hero Landing Page**: Desain modern high-impact gaming/agency style dengan animasi particle ember, live scoreboard, dan ringkasan fitur.
- **Android Mobile App View**: Interface responsif menyerupai aplikasi Android native pada layar smartphone (HP) lengkap dengan **Sticky Bottom Navigation Dock**.
- **Input Rekap & Dynamic Competition Management**:
  - Penambahan mata lomba baru secara dinamis via modal ("➕ TAMBAH JENIS LOMBA").
  - Skema Penilaian Tunggal (Single Score 0-100) dan Ganda (Teori + Praktek).
- **Perhitungan Otomatis & Juara Umum**:
  - Leaderboard per tingkat (SD, SMP, Penegak) dan kategori (Putra & Putri).
  - Penanganan nilai sama (*tie breaker*) berbasis regulasi lomba resmi.
- **Ekspor Excel & Cetak SK Kejuaraan**:
  - Ekspor rekapitulasi nilai ke format MS Excel.
  - Generasi Surat Keputusan (SK) Pemenang resmi siap cetak.
- **Integrasi Backend & Offline First**:
  - PWA Service Worker (v6 Network-First) untuk keandalan venue offline.
  - Sinkronisasi otomatis ke MongoDB Atlas.

## 🚀 Panduan Deployment Vercel

Aplikasi ini sudah dikonfigurasi untuk **Zero-Config Deployment** di Vercel:
- **Repository**: `https://github.com/ahmad-xsam/simika.git`
- **Vercel Team/Project**: `ahmadsamsudin27-6085s-projects`
- **API Serverless Functions**: Otomatis terdeteksi pada folder `/api/*.js`.

---
&copy; SiMika - Dikembangkan oleh Kak Ahmad Samsudin, S.T.
