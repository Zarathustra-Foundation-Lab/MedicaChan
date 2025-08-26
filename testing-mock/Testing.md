# 🧪 DeHealth ICP Backend – Flow Testing

Dokumentasi testing fungsi-fungsi backend Rust untuk **DeHealth Staking dApp on ICP** melalui **UI canister (Candid UI)**.

---

## 🔑 Prasyarat

- Jalankan local replica ICP:
  dfx start

- Deploy backend Rust:
  dfx deploy

- Ambil **principal** valid:
  dfx identity get-principal

Contoh output:
r7inp-6aaaa-aaaaa-aaabq-cai

Gunakan principal ini di semua input JSON di bawah.

---

## 🧑‍⚕️ Flow Testing

### 1. Register User

Function: register_user

Input:
{
"principal": "r7inp-6aaaa-aaaaa-aaabq-cai",
"full_name": "Budi Santoso",
"age": 28,
"gender": "Male",
"height_cm": 172.5,
"weight_kg": 68.0,
"allergies": "Seafood",
"chronic_diseases": "Asthma"
}

Expected: return User dengan total_rewards = 0

---

### 2. Get User Profile

Function: get_user_profile

Input:
{ "principal": "r7inp-6aaaa-aaaaa-aaabq-cai" }

Expected: data sama dengan saat register

---

### 3. Add Checkup #1

Function: add_checkup

Input:
{
"principal": "r7inp-6aaaa-aaaaa-aaabq-cai",
"data": {
"temperature": 36.9,
"blood_pressure": "120/80",
"heart_rate": 72,
"respiration_rate": 18,
"sleep_hours": 7.5,
"mood": "Happy",
"activity_level": "Moderate",
"note": "Feeling good today",
"photo_url": "https://dummyimage.com/600x400/000/fff&text=Checkup+Photo"
}
}

Expected: return HealthCheckup dengan is_public = false

---

### 4. Add Checkup #2

Function: add_checkup

Input:
{
"principal": "r7inp-6aaaa-aaaaa-aaabq-cai",
"data": {
"temperature": 37.4,
"blood_pressure": "130/85",
"heart_rate": 80,
"respiration_rate": 20,
"sleep_hours": 6,
"mood": "Stressed",
"activity_level": "Low",
"note": "Slight headache",
"photo_url": null
}
}

Expected: return checkup kedua dengan is_public = false

---

### 5. Get User History

Function: get_user_history

Input:
{ "principal": "r7inp-6aaaa-aaaaa-aaabq-cai" }

Expected: array dengan 2 checkup

---

### 6. Publish Checkup #1

Function: publish_checkup

Input:
{
"principal": "r7inp-6aaaa-aaaaa-aaabq-cai",
"checkup_id": "<ID dari checkup pertama>"
}

Expected: sukses, is_public = true, total_rewards += 10

---

### 7. Publish Checkup #1 Lagi (Negative Test)

Function: publish_checkup

Input:
{
"principal": "r7inp-6aaaa-aaaaa-aaabq-cai",
"checkup_id": "<ID dari checkup pertama>"
}

Expected: error "Checkup already published"

---

### 8. Get Public Data

Function: get_public_data

Input:
{}

Expected: hanya tampil checkup #1

---

### 9. Reward User Manual

Function: reward_user

Input:
{
"principal": "r7inp-6aaaa-aaaaa-aaabq-cai",
"points": 20
}

Expected: total_rewards bertambah 20

---

### 10. Get Balance

Function: get_user_balance

Input:
{ "principal": "r7inp-6aaaa-aaaaa-aaabq-cai" }

Expected: total_rewards = 30  
(10 dari publish + 20 dari reward manual)

---

## ✅ Kesimpulan

Jika semua langkah berhasil:

- Registrasi user ✔
- Tambah checkup ✔
- Publish checkup ✔
- Reward system ✔
- Data publik & privat konsisten ✔
