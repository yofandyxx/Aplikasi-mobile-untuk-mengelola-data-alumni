# PPNPAlumni

Aplikasi mobile untuk mengelola data alumni, perusahaan, dan riwayat pekerjaan alumni. Aplikasi dibuat menggunakan Expo, React Native, dan TypeScript, dengan Google Apps Script sebagai backend API serta Cloudinary untuk penyimpanan foto alumni.

## Fitur

- Dashboard ringkasan data alumni, perusahaan, dan pekerjaan.
- Manajemen data alumni: tambah, lihat detail, ubah, hapus, cari, dan ubah foto profil.
- Manajemen data perusahaan: tambah, ubah, hapus, dan cari.
- Manajemen pekerjaan alumni: tambah, ubah, hapus, tandai pekerjaan selesai, dan lihat riwayat pekerjaan.
- Statistik alumni berdasarkan program studi dan tahun lulus.
- Statistik status pekerjaan dan perusahaan.
- Laporan aplikasi.
- Navigasi tab untuk Dashboard, Alumni, Pekerjaan, Perusahaan, dan Profil.
- Upload foto menggunakan Cloudinary signed upload; `API_SECRET` tidak disimpan di aplikasi.

## Teknologi

- Expo SDK 58
- React Native 0.88
- React 19
- TypeScript
- React Navigation
- Google Apps Script Web App sebagai REST API
- Cloudinary sebagai penyimpanan gambar

## Persyaratan

- Node.js versi LTS
- npm
- Expo CLI melalui script project
- Expo Go untuk pengujian di perangkat fisik, atau emulator Android/iOS

## Instalasi

1. Masuk ke folder project:

   ```bash
   cd PPNPAlumni
   ```

2. Install dependency:

   ```bash
   npm install
   ```

3. Pastikan URL backend tersedia di `src/api/config.ts`:

   ```ts
   export const API_CONFIG = {
     BASE_URL: 'URL_GOOGLE_APPS_SCRIPT_WEB_APP',
     TIMEOUT_MS: 15000,
   } as const;
   ```

   Backend harus menyediakan endpoint yang digunakan pada `src/api/endpoints.ts`, termasuk endpoint alumni, perusahaan, pekerjaan, dashboard, statistik, dan signature Cloudinary.

## Menjalankan aplikasi

Jalankan development server:

```bash
npm start
```

Perintah platform:

```bash
npm run android  # Android emulator atau perangkat Android
npm run ios      # iOS simulator, macOS saja
npm run web      # Browser
```

Setelah server berjalan, scan QR code menggunakan Expo Go atau buka aplikasi pada emulator yang tersedia.

## Konfigurasi backend dan Cloudinary

Aplikasi mengambil dan mengubah data melalui Google Apps Script Web App. Konfigurasi URL API berada di:

```text
src/api/config.ts
```

Alur upload foto alumni:

1. Aplikasi meminta signature upload ke backend melalui endpoint `getCloudinarySignature`.
2. Backend mengembalikan signature sementara, API key, cloud name, folder, dan URL upload.
3. Aplikasi mengunggah gambar ke Cloudinary.
4. URL gambar disimpan pada data alumni melalui endpoint `updateAlumniPhoto`.

> Jangan menaruh `API_SECRET` Cloudinary di aplikasi mobile. Secret harus tetap berada di backend Google Apps Script atau layanan server yang aman.

## Struktur folder

```text
PPNPAlumni/
├── assets/              # Ikon dan aset Expo
├── src/
│   ├── api/             # Client API, konfigurasi, dan daftar endpoint
│   ├── components/      # Komponen UI yang dapat digunakan kembali
│   ├── constants/       # Tema dan konstanta aplikasi
│   ├── navigation/      # Konfigurasi React Navigation
│   ├── screens/         # Halaman aplikasi
│   ├── services/        # Akses data alumni, perusahaan, pekerjaan, dashboard
│   ├── types/           # Tipe data TypeScript
│   └── utils/           # Validasi, tanggal, gambar, dan penanganan error
├── App.tsx              # Entry point aplikasi
├── app.json             # Konfigurasi Expo
└── package.json         # Dependency dan script project
```

## Model data utama

- **Alumni**: NIM, nama, program studi, tahun lulus, kontak, alamat, keahlian, status pekerjaan, dan foto.
- **Perusahaan**: nama, industri, lokasi, alamat, dan deskripsi.
- **Pekerjaan**: alumni, perusahaan, posisi, industri, lokasi kerja, tanggal mulai/selesai, status, dan deskripsi.

## Pemeriksaan kode

TypeScript dapat diperiksa dengan:

```bash
npx tsc --noEmit
```

Untuk menjalankan pemeriksaan kesehatan Expo:

```bash
npx expo-doctor
```

## Lisensi

Project ini menggunakan lisensi yang tercantum pada file [LICENSE](./LICENSE).
