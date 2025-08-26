![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)

# MedicaChan x Internet Computer (Rust Backend)

Proyek ini merupakan aplikasi kesehatan berbasis Internet Computer Protocol (ICP) dengan backend Rust dan agen cerdas Fetch.ai. Aplikasi ini memungkinkan pengguna untuk mendaftar, mencatat pemeriksaan kesehatan harian, membagikan data kesehatan secara publik, dan mendapatkan imbalan poin.

## Arsitektur Sistem

Proyek ini terdiri dari tiga komponen utama:

1. **Frontend (Next.js)**: Antarmuka pengguna berbasis React dengan Tailwind CSS yang berjalan di Internet Computer
2. **Backend (Rust Canister)**: Logika bisnis dan penyimpanan data yang berjalan di ICP sebagai canister Rust
3. **Agent Cerdas (Fetch.ai)**: Agen berbasis AI yang memproses permintaan alami dan berinteraksi dengan backend

## Fitur Utama

### 1. Manajemen Profil Pengguna

- Pendaftaran pengguna baru dengan informasi pribadi
- Penyimpanan data demografi dan riwayat medis
- Otentikasi berbasis Internet Identity

### 2. Pencatatan Kesehatan

- Pencatatan pemeriksaan harian (temperatur, tekanan darah, detak jantung, mood, dll.)
- Penyimpanan data pribadi dan publik
- Riwayat pemeriksaan kesehatan

### 3. Sistem Imbalan

- Poin imbalan untuk berbagi data kesehatan
- Pelacakan total poin pengguna
- Insentif untuk partisipasi komunitas

### 4. Antarmuka Berbasis AI

- Interaksi alami melalui agen Fetch.ai
- Pemrosesan bahasa alami untuk perintah kesehatan
- Integrasi dengan ASI:One LLM

## Teknologi yang Digunakan

### Frontend

- Next.js 15
- React 19
- Tailwind CSS
- Shadcn UI
- TypeScript

### Backend

- Rust
- Internet Computer SDK (ic-cdk)
- Candid interface
- Canister Storage

### AI & Integrasi

- Fetch.ai Agent Framework
- ASI:One LLM
- uAgents Protocol
- REST API Integration

## Struktur Proyek

```
fetchai-ic-rust/
├── fetch                     # Fetch.ai agent implementation
│   ├── agent.py              # Agent utama dengan logika AI
│   ├── tools.py              # Definisi fungsi untuk AI
│   └── private_keys.json     # Kunci privat untuk agen
├── ic/                       # Internet Computer components
│   ├── src/
│   │   ├── backend/          # Rust canister backend
│   │   │   ├── src/          # Kode sumber Rust
│   │   │   │   └── lib.rs    # Titik masuk canister
│   │   │   ├── backend.did   # Definisi antarmuka Candid
│   │   │   └── Cargo.toml    # Konfigurasi paket Rust
│   │   └── frontend/         # Aplikasi Next.js
│   │       └── src/          # Kode sumber frontend
│   ├── dfx.json              # Konfigurasi proyek ICP
│   └── Cargo.toml            # Manifes workspace Rust
└── README.md                 # Dokumentasi proyek
```

## Endpoint API Backend

Canister Rust menyediakan endpoint berikut:

- `register_user`: Mendaftarkan pengguna baru
- `add_checkup`: Menambahkan pemeriksaan kesehatan
- `publish_checkup`: Membagikan data kesehatan secara publik
- `reward_user`: Memberikan poin imbalan
- `get_user_profile`: Mengambil profil pengguna
- `get_public_data`: Mengambil data kesehatan publik
- `get_private_data`: Mengambil data kesehatan pribadi
- `get_user_history`: Mengambil riwayat kesehatan pengguna

## Cara Menjalankan

### 1. Setup Lingkungan

```bash
# Instal dependensi frontend
cd ic/src/frontend
npm install

# Instal dependensi agent
cd ../../fetch
pip install -r requirements.txt
```

### 2. Jalankan Replica Lokal ICP

```bash
cd ../ic
dfx start --clean --background
```

### 3. Deploy Canister

```bash
dfx deploy
```

### 4. Konfigurasi Agent

1. Dapatkan API key dari [asi1.ai](https://asi1.ai/)
2. Setel API key di `fetch/agent.py`:

```python
ASI1_API_KEY = "YOUR_ASI1_API_KEY"
```

3. Ganti CANISTER_ID dengan ID canister yang dideploy

### 5. Jalankan Agent

```bash
cd ../fetch
python3 agent.py
```

### 6. Akses Aplikasi

Buka browser dan akses:

- Frontend: http://localhost:4943
- Agent Inspector: Lihat URL di terminal saat menjalankan agent.py

## Interaksi dengan Agent

Agent dapat dipanggil dengan perintah alami seperti:

**Pendaftaran:**

- "Daftarkan saya sebagai Budi, 25 tahun, laki-laki, tinggi 170, berat 65"

**Pencatatan Kesehatan:**

- "Tambahkan pemeriksaan: suhu 37.2, tekanan darah 120/80, detak jantung 75, mood senang"

**Publikasi Data:**

- "Bagikan pemeriksaan terakhir saya dengan ID=abcd-1234"

**Permintaan Data:**

- "Tampilkan profil saya"
- "Tunjukkan semua data kesehatan publik"
- "Apa riwayat kesehatan saya?"
