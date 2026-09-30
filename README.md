# Media Prima Payment Requisition Form (PRF) Management Portal

Enterprise Payment Requisition Form (PRF) system for Media Prima Berhad to generate, review, approve, and export audit-ready PDF payment requisitions with Firebase Cloud Firestore and multi-user authentication.

---

## 🌟 Overview & Objectives

The **Media Prima PRF Management Portal** simplifies PRF creation and eliminates paper-based routing. It provides an intuitive end-to-end workflow for HR personnel, managers, and heads of department (HOD) to manage payment requisitions with digital signatures, rigorous audit trails, multi-user authentication, and instant PDF generation strictly matching the official corporate template (`SAMPLE PRF Royale Chulan_2.docx`).

---

## 🚀 Log Perubahan Terkini (Changelog & Recent Updates)

### 1. 🔥 Integrasi Firebase Cloud Firestore (Penyimpanan Masa-Nyata)
- **Pengkalan Data Awan Berpusat**: Mengintegrasikan **Firebase Cloud Firestore** (wilayah `asia-southeast1`, Database ID: `ai-studio-mediaprimaprfman-79482b94-7bf6-488b-a1a6-c5a72dbe048b`).
- **Penyegerakan Masa-Nyata (*Real-Time Sync*)**: Semua data borang PRF (`prf_items`), butiran pecahan bajet (`budgetBreakdown`), pautan invois, tandatangan digital, dan status audit dikemas kini serta-merta tanpa perlu memuat semula halaman.
- **Keselamatan Firestore Rules**: Dilindungi oleh peraturan keselamatan ketat (`firestore.rules`) dengan pengesahan ID dan kawalan capaian berasaskan peranan (RBAC).

### 2. 🔐 Gerbang Keselamatan & Log Masuk Pelbagai Pengguna (*Multi-User Auth Gate*)
- **Skrin Mula Wajib Log Masuk**: Pengguna baharu atau sesi belum sah akan dipaparkan halaman **Log Masuk (Sign In)** atau **Daftar Akaun (Sign Up)** terlebih dahulu sebelum dibenarkan mengakses portal.
- **Kaedah Log Masuk Fleksibel**:
  - **Google Single Sign-On (1-Klik)**: Log masuk pantas menggunakan akaun Google Media Prima.
  - **Daftar Akaun / Log Masuk Emel & Kata Laluan**: Membolehkan pendaftaran kakitangan dengan nama penuh, No. ID Staf, bahagian/jabatan, dan pemilihan peranan (*Staff/Requester, Manager, HOD, Finance*).
  - **Profil Demo Segera**: Butang 1-klik untuk menguji peranan Salmah (*Requester*), Nor Intan (*Manager*), atau Dona Zawina (*HOD*).
- **Pengurusan Profil (`users/{userId}`)**: Profil pengguna disimpan dalam Firestore dan dipaparkan pada Header serta bahagian bawah Sidebar bersama butang **Log Keluar (Sign Out)**.
- **Auto-Isi Borang**: Borang *New PRF* secara pintar mengisi maklumat pemohon mengikut profil pengguna yang sedang log masuk.

### 3. 🎨 Logo Rasmi Media Prima 100% Mengikut Spesifikasi Korporat
- Menepati imej rasmi `download.png` secara **100% tepat (sebijik)**:
  - Kotak merah berbentuk segi empat tepat nisbah 1:1 (`aspectRatio: 1 / 1`) dengan bucu tajam 90 darjah (`rx="0"`, `borderRadius: 0px`) menggunakan warna korporat rasmi `#ED1C24`.
  - Tulisan `"media"` huruf kecil berwarna putih `#FFFFFF` tebal (*extrabold*) di tengah kotak merah.
  - Tulisan `"prima"` huruf kecil berwarna hitam `#000000` tebal (*font-weight: 900*) bersebelahan kotak merah dengan jajaran dasar (*baseline*) yang seimbang.
  - Dioptimumkan dalam bentuk vektor SVG resolusi tinggi (`MEDIA_PRIMA_SVG`) tanpa lengah masa muat turun PDF.

### 4. ✍️ Penambahbaikan Grid Tandatangan PRF (Mengikut `image.png`)
- Mengemaskini bahagian pengesahan dokumen mengikut susun atur standard 3 baris:
  - **Baris 1 (Atas)**: Petak tandatangan digital bagi ketiga-tiga lajur (`PREPARED BY`, `VERIFIED BY`, `APPROVED BY`).
  - **Baris 2 (Tengah - Sempadan Garisan Hitam Penuh)**:
    - **Lajur 1**: `{{REQUESTER NAME}}` & `EXE, TALENT DEV. & CULTURE`
    - **Lajur 2**: `NOR INTAN HASALIMAH HASHIM` & `SM, STRA. WORKFORCE & CAP. DEV`
    - **Lajur 3**: `DONA SITI ZAWINA DON NAJIB` & `GEN. MANAGER, S.O.D.E, GHR`
  - **Baris 3 (Bawah - Sempadan Garisan Hitam Penuh)**:
    - **Lajur 1**: `DATE: {{DATE}}`
    - **Lajur 2**: `DATE: [Tarikh Pengesahan Manager]`
    - **Lajur 3**: `DATE: [Tarikh Kelulusan HOD]`

### 5. 👔 Akses Khusus Superior & HOD serta Penukar Peranan Interaktif (*Interactive Role Switcher*)
- **Penukar Peranan Pantas Pada Header**: Lencana peranan pengguna (cth: `[STAFF]`) kini interaktif dan boleh diklik untuk menukar peranan secara serta-merta kepada **SUPERIOR / MANAGER**, **HOD (Head of Department)**, atau **STAFF**.
- **Penyimpanan Peranan ke Firestore**: Sebarang pertukaran peranan terus disimpan ke pengkalan data Firestore (`users/{userId}`) secara automatik.
- **Papan Pemuka Khusus (*Role-Tailored Dashboard*)**:
  - Apabila peranan **Superior / Manager** aktif: Banner amaran dan notifikasi permohonan menunggu semakan Superior dipaparkan berserta butang 1-klik ke **Giliran Pengesahan Superior**.
  - Apabila peranan **HOD** aktif: Banner amaran kelulusan eksekutif dipaparkan berserta butang 1-klik ke **Giliran Kelulusan HOD**.
- **Identiti Penandatangan Dinamik**: Nama pegawai yang mengesahkan (Superior) dan meluluskan (HOD) dipadankan secara langsung dengan profil pengguna aktif.

---

## 📋 Ciri-Ciri Utama Sistem

### 1. Navigasi Aliran Kerja 6 Peringkat
- 📊 **Dashboard**: Metrik KPI masa-nyata, ringkasan status, penapisan pantas, dan carian teks penuh.
- 📝 **New Form**: Borang dua lajur dengan pra-isi automatik daripada profil pengguna, jadual pecahan kos, muat naik lampiran invois, dan pad tandatangan digital interaktif.
- 👔 **Manager Queue**: Giliran semakan untuk Pengurus Kanan (SM Nor Intan Hasalimah Hashim) menandatangani pengesahan atau menolak dengan ulasan mandatori.
- 👑 **HOD Queue**: Giliran kelulusan eksekutif untuk Pengurus Besar (GM Dona Siti Zawina Don Najib) sebelum dana dilepaskan oleh Bahagian Kewangan.
- ❌ **Rejected Tab**: Daftar audit sejarah semua borang yang ditolak berserta justifikasi rasmi dan fungsi klon 1-klik untuk pembetulan.
- ✅ **Successful Tab & PDF Export**: Arkib borang yang telah diluluskan sepenuhnya dengan muat turun PDF berketepatan tinggi.
- 📖 **README Hub**: Dokumentasi interaktif dalam aplikasi dan panduan pengguna.

### 2. Jadual Kakitangan & Pratetap
| Nama Kakitangan | No. ID Staf | Emel Rasmi | Jabatan | Peranan |
| :--- | :--- | :--- | :--- | :--- |
| **SALMAH ALIMUDDIN** | `137800` | `salmah@mediaprima.com.my` | Human Resources | Staff / Requester |
| **NOR INTAN HASALIMAH HASHIM** | `MPB0421` | `norintan@mediaprima.com.my` | Workforce & Cap. Dev | Senior Manager (Pengesah) |
| **DONA SITI ZAWINA DON NAJIB** | `MPB0118` | `dona.zawina@mediaprima.com.my` | S.O.D.E, GHR | General Manager (Pelulus) |
| **WAN HUZAIRY BIN WAN HUSSIN** | `MPB0675` | `huzairy@mediaprima.com.my` | Human Resources | Staff / Requester |
| **ERINA SHEREEN BINTI ABDUL JAMIL** | `MPD0055` | `erina@mediaprima.com.my` | Human Resources | Staff / Requester |

### 3. Pematuhan Garis Panduan Korporat
- **Pengecualian Medan**: Medan **Cost Center** dan **Broadcast Location** dikecualikan sepenuhnya mengikut ketetapan dokumen PRD.
- **Tandatangan Digital Berbilang Mod**:
  - ✍️ Pad lukisan interaktif kanvas HTML5
  - 📤 Muat naik imej tandatangan (PNG, JPG, SVG)
  - ⚡ Pratetap tandatangan rasmi 1-klik
- **Ulasan Penolakan Mandatori**: Setiap penolakan oleh Pengurus atau HOD mewajibkan input ulasan yang disimpan kekal dalam log audit.

---

## 🛠️ Rangkaian Teknologi (Tech Stack)

- **Frontend Framework**: React 19 dengan TypeScript & Vite
- **Pangkalan Data & Auth**: Google Firebase Cloud Firestore & Firebase Authentication
- **Gaya Visual**: Tailwind CSS v4 dengan tema eksekutif Media Prima (`#ED1C24`)
- **Ikon**: Lucide React
- **Eksport PDF Dokumen**: jsPDF + html2canvas dengan sokongan vektor grafik bebas ralat warna OKLCH

---

## 🚀 Panduan Menjalankan Aplikasi

### Pembangunan Tempatan (Local Development)
```bash
npm install
npm run dev
```
Aplikasi akan beroperasi pada `http://localhost:3000`.

### Membina untuk Pengeluaran (Production Build)
```bash
npm run build
```
Menjalankan semakan jenis TypeScript (`tsc --noEmit`) dan kompilasi Vite tanpa sebarang ralat.
