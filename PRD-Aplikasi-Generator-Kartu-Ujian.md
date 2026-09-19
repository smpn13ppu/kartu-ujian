# PRD — Aplikasi Generator Kartu Ujian Otomatis

**Versi:** 1.0
**Tanggal:** 19 September 2026
**Status:** Draft untuk Review

---

## 1. Latar Belakang

Sekolah membutuhkan kartu identitas ujian untuk setiap peserta didik yang berisi data diri, foto, dan tanda tangan pejabat sekolah. Proses pembuatan kartu ujian secara manual (misalnya lewat Word/Excel/desain satu per satu) memakan waktu lama dan rawan human error, terutama untuk jumlah peserta yang besar (±400 siswa).

Aplikasi ini akan mengotomasi proses tersebut: admin sekolah cukup mengunggah data Excel, foto siswa (ZIP), logo, dan tanda tangan, lalu sistem menghasilkan kartu ujian siap cetak dalam format PDF, dengan tata letak yang bisa diatur (6 atau 8 kartu per lembar, ukuran kertas A4/F4).

---

## 2. Tujuan Produk

1. Memungkinkan admin sekolah membuat seluruh kartu ujian (±400 siswa) dalam hitungan menit, bukan jam/hari.
2. Menghasilkan kartu ujian dengan desain profesional dan rapi, siap cetak.
3. Meminimalkan kesalahan input data lewat validasi otomatis (NISN duplikat, foto tidak ditemukan, dll).
4. Tidak memerlukan instalasi/login — cukup akses via browser (web app di Vercel).

---

## 3. Target Pengguna

- **Admin/Panitia Ujian Sekolah** — pengguna tunggal (single-user tool), tidak ada multi-tenant, tidak ada sistem login.
- Skala pemakaian: internal 1 sekolah, ±400 peserta per proses generate.

---

## 4. Ruang Lingkup (Scope)

### 4.1 Termasuk (In-Scope)
- Upload data peserta via Excel.
- Upload foto peserta secara massal via ZIP (dicocokkan otomatis berdasarkan NISN).
- Upload 2 logo header (sekali, berlaku untuk semua kartu).
- Upload tanda tangan Kepala Sekolah (wajib) dan Ketua Panitia (opsional), masing-masing sekali pakai untuk semua kartu.
- Pengaturan ukuran kertas: A4 (210 x 297 mm) dan F4/Folio (210 x 330 mm).
- Pengaturan jumlah kartu per lembar: 6 atau 8 kartu (layout otomatis menyesuaikan).
- Opsi garis potong (cutting guide) — bisa aktif/nonaktif.
- Preview hasil kartu sebelum diunduh.
- Generate & download output final dalam bentuk PDF siap cetak.
- Desain kartu ujian yang profesional dan menarik (template bawaan aplikasi).

### 4.2 Tidak Termasuk (Out of Scope)
- Sistem login/akun/multi-user.
- Multi-tenant (banyak sekolah dalam satu sistem).
- QR code / barcode / nomor validasi tambahan pada kartu.
- Penyimpanan riwayat generate jangka panjang (kecuali disepakati memakai Google Sheets sebagai penyimpanan sementara/opsional).
- Custom drag-and-drop layout kartu oleh user (layout diatur otomatis oleh sistem).
- Edit desain kartu oleh user (template tetap, tidak ada page builder).

---

## 5. Alur Pengguna (User Flow)

1. **Buka aplikasi** (tanpa login).
2. **Pengaturan Awal (Settings)**
   - Upload Logo 1 dan Logo 2 (header kartu).
   - Upload tanda tangan Kepala Sekolah (wajib).
   - Upload tanda tangan Ketua Panitia (opsional).
   - Isi nama sekolah (jika tidak diambil dari Excel) — *lihat catatan asumsi di bagian 8*.
3. **Upload Data**
   - Upload file Excel data peserta (Nama, NISN, Kelas, Ruangan).
   - Upload file ZIP foto peserta (opsional), nama file foto = NISN (misal `1234567890.jpg`).
4. **Validasi Otomatis**
   - Sistem mengecek: NISN duplikat, kolom wajib kosong, foto tidak ketemu (fallback ke placeholder/kosong), format file salah.
   - Menampilkan ringkasan hasil validasi (jumlah data valid, jumlah warning/error) sebelum lanjut.
5. **Pengaturan Layout Cetak**
   - Pilih ukuran kertas: A4 / F4.
   - Pilih jumlah kartu per lembar: 6 / 8.
   - Aktifkan/nonaktifkan garis potong.
6. **Preview**
   - Menampilkan preview kartu (per halaman/scroll) sebelum export.
7. **Generate & Download**
   - Klik "Generate PDF" → sistem membuat file PDF seluruh kartu sesuai layout.
   - Download file PDF.

---

## 6. Kebutuhan Fungsional (Functional Requirements)

### FR-1: Upload Data Excel
- Format: `.xlsx` / `.xls`.
- Kolom wajib: `Nama Peserta`, `NISN`, `Kelas`, `Ruangan`.
- Sistem membaca baris pertama sebagai header, mapping otomatis (dengan toleransi variasi nama kolom umum, misal "Nama" vs "Nama Peserta").
- Menampilkan preview tabel data setelah upload, agar admin bisa cek sebelum lanjut.
- Validasi: NISN wajib unik, tidak boleh kosong; baris kosong diabaikan otomatis.

### FR-2: Upload Foto Peserta (ZIP)
- Format: `.zip` berisi file gambar (`.jpg`, `.jpeg`, `.png`).
- Sistem mencocokkan nama file dengan NISN (misal `3131xxxxxx.jpg` → peserta dengan NISN `3131xxxxxx`).
- Jika foto untuk suatu NISN tidak ditemukan → kartu tetap digenerate dengan placeholder foto (kotak kosong/ikon default), tidak menggagalkan proses.
- Menampilkan ringkasan: "X dari Y peserta memiliki foto".

### FR-3: Upload Logo Header
- 2 slot upload logo (format `.png`/`.jpg`, disarankan background transparan untuk `.png`).
- Logo ditampilkan di kiri dan kanan header kartu.
- Berlaku untuk seluruh kartu dalam satu sesi generate.

### FR-4: Upload Tanda Tangan
- TTD Kepala Sekolah: **wajib**, format gambar.
- TTD Ketua Panitia: **opsional**, format gambar. Jika tidak diupload, area TTD panitia tidak ditampilkan atau ditampilkan kosong (perlu ditentukan saat desain — lihat bagian 8).
- Masing-masing satu gambar berlaku untuk semua kartu.

### FR-5: Pengaturan Kertas & Layout
- Pilihan ukuran kertas:
  - A4 = 210 x 297 mm
  - F4/Folio = 210 x 330 mm
- Pilihan jumlah kartu per lembar: 6 atau 8.
- Sistem otomatis menghitung ukuran & posisi kartu berdasarkan kombinasi ukuran kertas + jumlah kartu (termasuk margin cetak aman).
- Toggle "Tampilkan garis potong" (dashed line) — on/off.

### FR-6: Preview
- Menampilkan preview visual kartu (minimal 1 halaman contoh, idealnya seluruh halaman/scrollable) sebelum export final.
- Preview merefleksikan pengaturan kertas, jumlah kartu per lembar, dan garis potong secara real-time.

### FR-7: Generate PDF
- Output: file PDF multi-halaman, siap cetak, sesuai ukuran kertas yang dipilih.
- Setiap kartu berisi: Logo (2), Nama Sekolah, Nama Peserta, NISN, Kelas, Ruangan, Foto Peserta (jika ada), TTD Kepsek, TTD Ketua Panitia (jika ada).
- Nama file PDF menyertakan tanggal generate, misal `kartu-ujian-2026-09-19.pdf`.
- Proses generate untuk ±400 siswa harus selesai dalam waktu wajar (lihat NFR).

### FR-8: Validasi & Error Handling
- Menampilkan pesan jelas jika: file Excel tidak sesuai format, kolom wajib hilang, ZIP tidak valid, ukuran file terlalu besar.
- Tidak menggagalkan seluruh proses hanya karena sebagian data/foto bermasalah — tampilkan warning, lanjutkan dengan data yang valid.

---

## 7. Spesifikasi Desain Kartu

- Desain profesional, bersih, dengan identitas visual sekolah (logo di header).
- Elemen kartu (susunan disarankan, dapat disesuaikan saat desain UI):
  - **Header:** Logo kiri — Nama Sekolah & judul "Kartu Peserta Ujian" (tengah) — Logo kanan.
  - **Body:** Foto peserta (kiri/kanan), di sampingnya data: Nama, NISN, Kelas, Ruangan.
  - **Footer:** Tanda tangan Kepala Sekolah, dan Ketua Panitia (jika ada), dengan label jabatan.
- Ukuran kartu menyesuaikan otomatis berdasarkan kombinasi kertas + jumlah kartu per lembar:
  - A4, 8 kartu/lembar → grid 2 kolom x 4 baris.
  - A4, 6 kartu/lembar → grid 2 kolom x 3 baris.
  - F4, 8 kartu/lembar → grid 2 kolom x 4 baris (ukuran kartu sedikit lebih besar).
  - F4, 6 kartu/lembar → grid 2 kolom x 3 baris (ukuran kartu sedikit lebih besar).
- Garis potong (opsional): garis putus-putus tipis di antara kartu, warna abu-abu terang agar tidak mengganggu desain saat tidak dicetak sebagai panduan gunting.

---

## 8. Asumsi & Hal yang Perlu Dikonfirmasi

Beberapa asumsi diambil agar PRD ini bisa lengkap; mohon dikonfirmasi/direvisi:

1. **Nama Sekolah** — karena kolom Excel hanya Nama, NISN, Kelas, Ruangan, diasumsikan Nama Sekolah diisi manual sekali di halaman Pengaturan (berlaku untuk semua kartu), bukan per baris data.
2. **Jabatan penandatangan** — diasumsikan ada field teks untuk nama & jabatan Kepala Sekolah (dan Ketua Panitia) yang ditampilkan di bawah tanda tangan.
3. **Placeholder foto** — jika foto peserta tidak diupload/tidak cocok, kartu tetap tampil dengan kotak foto kosong/ikon silhouette default.
4. **Penyimpanan data** — karena tidak ada login dan pemakaian sekali proses per generate, Google Sheets sebagai database **opsional**, hanya dipakai jika diperlukan untuk log/histori. Untuk versi awal (MVP), data cukup diproses in-memory/temporary per sesi (tidak disimpan permanen) demi kesederhanaan dan privasi data siswa.
5. **Retensi file upload** — file yang diupload (Excel, ZIP foto, logo, TTD) tidak disimpan permanen di server; hanya digunakan selama sesi generate berlangsung, lalu dihapus.

---

## 9. Kebutuhan Non-Fungsional (NFR)

| Aspek | Target |
|---|---|
| Waktu proses generate | ±400 kartu selesai dalam < 60 detik |
| Ukuran maksimal upload Excel | 5 MB |
| Ukuran maksimal upload ZIP foto | 100 MB (±400 foto) |
| Kompatibilitas browser | Chrome, Edge, Firefox (versi terbaru) |
| Responsif | Optimal di desktop (tool admin), tidak wajib mobile-first |
| Ketersediaan | Sesuai batas platform Vercel (serverless), tanpa jaminan uptime khusus |
| Keamanan data | Tidak menyimpan data pribadi siswa secara permanen di server |

---

## 10. Tech Stack (Usulan)

- **Frontend/Backend:** Next.js (App Router), di-deploy di Vercel.
- **Generate PDF:** Library rendering PDF di sisi server (misal `@react-pdf/renderer` atau render HTML→PDF via headless browser, dipilih sesuai kebutuhan kualitas cetak & batas waktu eksekusi serverless Vercel).
- **Parsing Excel:** `xlsx`/`SheetJS`.
- **Parsing ZIP:** library ekstraksi ZIP di Node.js (misal `jszip` atau `adm-zip`).
- **Database (opsional):** Google Sheets API — hanya jika dibutuhkan untuk log riwayat generate, bukan untuk data inti proses.

*Catatan: perlu dicek batas waktu eksekusi function di Vercel (timeout) terkait proses generate PDF 400 kartu — kemungkinan perlu proses batching atau menaikkan tier Vercel jika standar plan tidak cukup.*

---

## 11. Metrik Keberhasilan

- Admin dapat menyelesaikan proses upload → generate → download kartu ujian untuk 400 siswa dalam waktu < 15 menit total (termasuk persiapan file).
- Tingkat error data (NISN tidak cocok, foto hilang) dapat diketahui admin sebelum proses generate final (bukan setelah PDF jadi).
- Hasil PDF langsung siap cetak tanpa perlu editing manual tambahan.

---

## 12. Rencana Pengembangan Lanjutan (Future Enhancements — Tidak untuk MVP)

- Multi-sekolah / multi-tenant dengan login.
- Template desain kartu yang bisa dipilih/dikustom oleh user.
- QR code/barcode validasi kartu.
- Riwayat generate tersimpan (Google Sheets/DB) untuk audit.
- Export selain PDF (misal gambar per kartu).

---

## 13. Pertanyaan Terbuka (Perlu Jawaban Sebelum Development)

1. Apakah Nama Sekolah diisi manual di Pengaturan, atau ingin ditambahkan sebagai kolom di Excel?
2. Apakah perlu field nama & jabatan di bawah tanda tangan (misal "Drs. Ahmad, M.Pd — Kepala Sekolah")?
3. Apakah histori/log generate sebelumnya perlu disimpan (via Google Sheets), atau setiap sesi generate berdiri sendiri tanpa riwayat?
4. Apakah ada kebutuhan multi-bahasa (Indonesia saja, atau perlu Inggris juga)?
