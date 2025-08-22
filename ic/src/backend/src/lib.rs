use std::{cell::RefCell, collections::HashMap};

use candid::CandidType;
use ic_cdk::{api::time, export_candid};
use ic_principal::Principal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

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

#[ic_cdk::update]
pub fn add_checkup(principal: Principal, data: HealthData) -> Result<HealthCheckup, String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        let user = users
            .get_mut(&principal)
            .ok_or("User not found".to_string())?;
        let checkup_id = Uuid::new_v4().to_string();

        let checkup = HealthCheckup {
            id: checkup_id,
            date: time(),
            data,
            is_public: false,
        };

        user.health_data.push(checkup.clone());
        Ok(checkup)
    })
}

#[ic_cdk::update]
pub fn publish_checkup(principal: Principal, checkup_id: String) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();

        let user = users
            .get_mut(&principal)
            .ok_or("User not found".to_string())?;

        if let Some(checkup) = user.health_data.iter_mut().find(|c| c.id == checkup_id) {
            if checkup.is_public {
                return Err("Checkup already published".to_string());
            }
            checkup.is_public = true;
            user.total_rewards += 10;

            Ok(())
        } else {
            Err("Checkup not found".to_string())
        }
    })
}

#[ic_cdk::update]
pub fn reward_user(principal: Principal, points: u64) -> Result<User, String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();

        match users.get_mut(&principal) {
            Some(user) => {
                user.total_rewards += points;
                Ok(user.clone())
            }
            None => Err("User not found".to_string()),
        }
    })
}

#[ic_cdk::query]
pub fn get_user_profile(principal: Principal) -> Result<User, String> {
    USERS.with(|users| {
        let users = users.borrow();

        match users.get(&principal) {
            Some(user) => Ok(user.clone()),
            None => Err("User not found".to_string()),
        }
    })
}

#[ic_cdk::query]
pub fn get_public_data() -> Vec<HealthCheckup> {
    USERS.with(|users| {
        let users = users.borrow();

        users
            .values()
            .flat_map(|user| {
                user.health_data
                    .iter()
                    .filter(|checkup| checkup.is_public)
                    .cloned()
            })
            .collect()
    })
}

#[ic_cdk::query]
pub fn get_private_data(principal: Principal) -> Result<Vec<HealthCheckup>, String> {
    USERS.with(|users| {
        let users = users.borrow();
        match users.get(&principal) {
            Some(user) => Ok(user.health_data.clone()),
            None => Err("User not found".to_string()),
        }
    })
}

#[ic_cdk::query]
pub fn get_user_history(principal: Principal) -> Result<Vec<HealthCheckup>, String> {
    USERS.with(|users| {
        let users = users.borrow();

        match users.get(&principal) {
            Some(user) => Ok(user.health_data.clone()),
            None => Err("User not found".to_string()),
        }
    })
}

export_candid!();