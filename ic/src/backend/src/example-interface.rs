// Minimal Function Interfaces for DeHealth dApp (Final Version)

use ic_cdk::export::Principal;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct HealthData {
    pub temperature: f32,
    pub blood_pressure: String,
    pub heart_rate: u32,
    pub respiration_rate: Option<u32>,
    pub sleep_hours: Option<f32>,
    pub mood: String,
    pub activity_level: Option<String>,
    pub note: String,
    pub photo_url: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct HealthCheckup {
    pub id: String,
    pub date: u64,
    pub data: HealthData,
    pub is_public: bool,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: Principal,
    pub full_name: String,
    pub age: u32,
    pub gender: String,
    pub height_cm: Option<f32>,
    pub weight_kg: Option<f32>,
    pub allergies: Option<String>,
    pub chronic_diseases: Option<String>,
    pub total_rewards: u64,
    pub health_data: Vec<HealthCheckup>,
}

// -------------------------
// Function Interfaces
// -------------------------

// Register user setelah login Internet Identity
pub fn register_user(
    principal: Principal,
    full_name: String,
    age: u32,
    gender: String,
    height_cm: Option<f32>,
    weight_kg: Option<f32>,
    allergies: Option<String>,
    chronic_diseases: Option<String>,
) -> Result<User, String> { unimplemented!() }

// Ambil profil user
pub fn get_user_profile(principal: Principal) -> Option<User> { unimplemented!() }

// Tambah checkup (default private)
pub fn add_checkup(principal: Principal, data: HealthData) -> Result<HealthCheckup, String> { unimplemented!() }

// Ambil histori checkup user
pub fn get_user_history(principal: Principal) -> Vec<HealthCheckup> { unimplemented!() }

// Publish checkup sekali saja (irreversible)
pub fn publish_checkup(principal: Principal, checkup_id: String) -> Result<(), String> { unimplemented!() }

// Ambil semua data publik (untuk Fetch AI)
pub fn get_public_data() -> Vec<(Principal, HealthCheckup)> { unimplemented!() }

// Ambil data private dengan credential
pub fn get_private_data(principal: Principal, checkup_id: String, name: String) -> Option<HealthCheckup> { unimplemented!() }

// Tambahkan reward ke user
pub fn reward_user(principal: Principal, amount: u64) -> Result<(), String> { unimplemented!() }

// Ambil balance reward user
pub fn get_user_balance(principal: Principal) -> u64 { unimplemented!() }
