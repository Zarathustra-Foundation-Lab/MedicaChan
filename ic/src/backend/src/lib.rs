use std::{cell::RefCell, collections::HashMap};

use candid::CandidType;
use ic_principal::Principal;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, CandidType)]
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

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub struct HealthCheckup {
    pub id: String,
    pub date: u64,
    pub data: HealthData,
    pub is_public: bool,
}

#[derive(Clone, Serialize, Deserialize, CandidType)]
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

thread_local! {
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
pub fn register_user(
    principal: Principal,
    full_name: String,
    age: u32,
    gender: String,
    height_cm: Option<f32>,
    weight_kg: Option<f32>,
    allergies: Option<String>,
    chronic_diseases: Option<String>,
) -> Result<User, String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();

        if users.contains_key(&principal) {
            return Err("User already registered".to_string());
        }

        let user = User {
            id: principal,
            full_name,
            age,
            gender,
            height_cm,
            weight_kg,
            allergies,
            chronic_diseases,
            total_rewards: 0,
            health_data: Vec::new(),
        };

        users.insert(principal, user.clone());
        Ok(user)
    })
}
