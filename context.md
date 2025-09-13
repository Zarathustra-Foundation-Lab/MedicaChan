# Context untuk Proyek FetchAI IC Rust

## Ringkasan Integrasi Frontend dan Backend

### 1. Pemahaman Arsitektur Sistem
- Aplikasi berbasis Next.js dengan arsitektur modular menggunakan Internet Computer (IC) sebagai backend
- Arsitektur frontend menggunakan React.js dengan pendekatan komponen dan custom hooks
- Backend Rust menggunakan Internet Computer dengan pendekatan actor model dan fungsi query/update
- Pola navigasi menggunakan sidebar dengan rute utama: Dashboard, Add Checkup, History, Profile
- Komunikasi antara frontend dan backend menggunakan actor pattern dengan dfx agent

### 2. Masalah dan Perbaikan yang Telah Diterapkan

#### Problem 1: Data tidak di-refetch saat navigasi dengan sidebar
- **Kasus**: Data tidak diambil ulang saat navigasi antar halaman menggunakan sidebar
- **Penyebab**: Hook `useUserProfile` tidak memiliki mekanisme untuk memicu refetch saat perubahan rute
- **Solusi**: 
  - Memodifikasi `useService` dan `useUserProfile` untuk mendukung retry otomatis hingga 3 kali
  - Menambahkan `useSearchParams` di komponen Dashboard untuk memicu refetch saat navigasi
  - Implementasi backoff eksponensial untuk retry dengan delay bertahap

#### Problem 2: Error Runtime RangeError: Invalid time value
- **Kasus**: Error terjadi saat transformasi tanggal dari data checkup di Dashboard dan History
- **Penyebab**: Backend mengirimkan timestamp sebagai BigInt dalam nanodetik, sedangkan JavaScript membutuhkan milidetik
- **Solusi**:
  - Implementasi penanganan khusus untuk BigInt dari backend
  - Konversi dari nanodetik ke milidetik dengan pembagian 1,000,000
  - Penambahan validasi ketat untuk nilai timestamp dengan range cek
  - Penggunaan `Intl.DateTimeFormat` untuk format tanggal yang lebih ramah pengguna

#### Problem 3: Integrasi halaman History
- **Kasus**: Halaman History menggunakan data mock dan tidak terhubung dengan backend
- **Penyebab**: Backend memiliki fungsi `get_user_history` tetapi tidak ada hook frontend yang menggunakannya
- **Solusi**:
  - Implementasi hook `useGetUserHistory` baru di `use-backend.ts` dengan retry otomatis
  - Penyederhanaan komponen `HistoryView` dengan penghapusan antarmuka tipe yang tidak perlu
  - Implementasi fitur:
    - Publish/unpublish checkup langsung dari History
    - Filter berdasarkan jenis data (public/private)
    - Sortir berdasarkan tanggal, suhu, atau mood
    - Statistik otomatis (total, publik, pribadi, rata-rata suhu)

### 3. Pendekatan dan Prinsip yang Digunakan

#### Prinsip Pengembangan
- Prioritas pada kenyamanan pengguna: Menyembunyikan error dari tampilan dan menangani secara otomatis
- Konsistensi: Mempertahankan pola desain dan gaya penulisan kode yang konsisten
- Keamanan: Implementasi validasi data ketat terhadap input dari backend
- Performa: Menggunakan memoization dengan `useMemo` dan optimasi komponen dengan `useCallback`

#### Pola Desain
- Custom hooks untuk logika bisnis: Semua interaksi kompleks dengan backend dienkapsulasi dalam custom hooks
- Error handling sentral: Semua error ditangani di tingkat hook dengan strategi retry otomatis
- Transformasi data di frontend: Data mentah dari backend ditransformasi menjadi format yang sesuai untuk tampilan

### 4. Struktur dan Perilaku Kritis

#### Hook Kustom yang Telah Diimplementasikan
- `useService`: Membuat actor service dengan konfigurasi jaringan dinamis
- `useUserProfile`: Mengambil profil pengguna dengan retry otomatis
- `useGetUserHistory`: Mengambil histori checkup pengguna dengan retry otomatis
- `useAddCheckup`, `useGetPublicData`, `useGetPrivateData`, `usePublishCheckup`, `useRegisterUser`: Berbagai hook untuk operasi spesifik

#### Strategi Penanganan Error
- Sembunyikan error dari UI sambil mencatat di console
- Implementasi retry otomatis dengan backoff eksponensial
- Validasi data masukan ketat terhadap potensi error Invalid time value
- Fallback values untuk kasus data tanggal yang tidak valid

## Catatan untuk Pengembangan Lanjutan
- Hindari penggunaan `toISOString()` untuk format tanggal tampilan, gunakan `Intl.DateTimeFormat` dengan format spesifik
- Selalu tangani BigInt dari backend dengan konversi eksplisit dari nanodetik ke milidetik
- Gunakan strategi retry otomatis untuk semua operasi query ke backend
- Pertahankan pola menyembunyikan error dari UI sambil tetap mencatatnya di console
- Gunakan `useSearchParams` untuk memicu reload data saat navigasi antar halaman