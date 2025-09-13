use std::{cell::RefCell, collections::HashMap};

use candid::CandidType;
use ic_cdk::api::{management_canister::main::raw_rand, time};
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

async fn generate_uuid() -> String {
    let (res,) = raw_rand().await.unwrap();
    let bytes = &res[..16];

    // Format ke UUID v4 (tanpa pakai crate uuid)
    format!(
        "{:08x}-{:04x}-4{:03x}-{:04x}-{:012x}",
        u32::from_be_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]),
        u16::from_be_bytes([bytes[4], bytes[5]]),
        u16::from_be_bytes([bytes[6] & 0x0f, bytes[7]]), // version = 4
        u16::from_be_bytes([bytes[8] & 0x3f | 0x80, bytes[9]]), // variant
        u64::from_be_bytes([
            bytes[10], bytes[11], bytes[12], bytes[13], bytes[14], bytes[15], 0, 0
        ]) >> 16
    )
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
async fn add_checkup(principal: Principal, data: HealthData) -> Result<HealthCheckup, String> {
    let checkup_id = generate_uuid().await;

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        let user = users
            .get_mut(&principal)
            .ok_or("User not found".to_string())?;

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

#[ic_cdk::update]
pub fn update_profile_user(
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
        let user = users
            .get_mut(&principal)
            .ok_or("User not found".to_string())?;

        // Validasi minimal input
        if full_name.trim().is_empty() {
            return Err("Full name cannot be empty".to_string());
        }

        // Update field-by-field
        user.full_name = full_name;
        user.age = age;
        user.gender = gender;
        user.height_cm = height_cm;
        user.weight_kg = weight_kg;
        user.allergies = allergies;
        user.chronic_diseases = chronic_diseases;

        Ok(user.clone())
    })
}

// --------------- Tambahan untuk expose REST-like API ---------------

use ic_http_certification::{HttpRequest, HttpResponse, HttpUpdateResponse};

// Request DTOs untuk HTTP API
#[derive(Deserialize)]
pub struct RegisterUserJson {
    pub principal: String,
    pub full_name: String,
    pub age: u32,
    pub gender: String,
    pub height_cm: Option<f32>,
    pub weight_kg: Option<f32>,
    pub allergies: Option<String>,
    pub chronic_diseases: Option<String>,
}

#[derive(Deserialize)]
pub struct AddCheckupJson {
    pub principal: String,
    pub data: HealthData,
}

#[derive(Deserialize)]
pub struct PublishCheckupJson {
    pub principal: String,
    pub checkup_id: String,
}

#[derive(Deserialize)]
pub struct RewardUserJson {
    pub principal: String,
    pub points: u64,
}

#[derive(Deserialize)]
pub struct GetUserJson {
    pub principal: String,
}

// Query entry point (untuk handshake, GET/OPTIONS)
#[ic_cdk::query]
fn http_request(_req: HttpRequest) -> HttpResponse<'static> {
    HttpResponse::builder().with_upgrade(true).build()
}

// Update entry point (routing POST request ke handler sesuai url)
#[ic_cdk::update]
async fn http_request_update(req: HttpRequest<'_>) -> HttpUpdateResponse<'_> {
    let url = req.url();

    if url.contains("/register-user") {
        handle_register_user(req)
    } else if url.contains("/add-checkup") {
        handle_add_checkup(req).await
    } else if url.contains("/publish-checkup") {
        handle_publish_checkup(req)
    } else if url.contains("/reward-user") {
        handle_reward_user(req)
    } else if url.contains("/get-profile") {
        handle_get_profile(req)
    } else if url.contains("/get-public-data") {
        handle_get_public_data()
    } else if url.contains("/get-private-data") {
        handle_get_private_data(req)
    } else if url.contains("/get-history") {
        handle_get_user_history(req)
    } else {
        error_response("Unknown endpoint")
    }
}

// ---------------- Handlers ----------------

fn handle_register_user(req: HttpRequest) -> HttpUpdateResponse<'static> {
    match serde_json::from_slice::<RegisterUserJson>(req.body()) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();
            match register_user(
                principal,
                r.full_name,
                r.age,
                r.gender,
                r.height_cm,
                r.weight_kg,
                r.allergies,
                r.chronic_diseases,
            ) {
                Ok(user) => json_response(&user),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

async fn handle_add_checkup(req: HttpRequest<'_>) -> HttpUpdateResponse<'_> {
    // Clone body biar aman di async context
    let body_bytes = req.body().to_vec();

    match serde_json::from_slice::<AddCheckupJson>(&body_bytes) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();

            // Sekarang bisa await karena handler async
            match add_checkup(principal, r.data).await {
                Ok(checkup) => json_response(&checkup),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

fn handle_publish_checkup(req: HttpRequest) -> HttpUpdateResponse<'static> {
    match serde_json::from_slice::<PublishCheckupJson>(req.body()) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();
            match publish_checkup(principal, r.checkup_id) {
                Ok(_) => json_response(&serde_json::json!({"status":"ok"})),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

fn handle_reward_user(req: HttpRequest) -> HttpUpdateResponse<'static> {
    match serde_json::from_slice::<RewardUserJson>(req.body()) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();
            match reward_user(principal, r.points) {
                Ok(user) => json_response(&user),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

fn handle_get_profile(req: HttpRequest) -> HttpUpdateResponse<'static> {
    match serde_json::from_slice::<GetUserJson>(req.body()) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();
            match get_user_profile(principal) {
                Ok(user) => json_response(&user),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

fn handle_get_public_data() -> HttpUpdateResponse<'static> {
    let data = get_public_data();
    json_response(&data)
}

fn handle_get_private_data(req: HttpRequest) -> HttpUpdateResponse<'static> {
    match serde_json::from_slice::<GetUserJson>(req.body()) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();
            match get_private_data(principal) {
                Ok(data) => json_response(&data),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

fn handle_get_user_history(req: HttpRequest) -> HttpUpdateResponse<'static> {
    match serde_json::from_slice::<GetUserJson>(req.body()) {
        Ok(r) => {
            let principal = Principal::from_text(r.principal).unwrap();
            match get_user_history(principal) {
                Ok(data) => json_response(&data),
                Err(e) => error_response(&e),
            }
        }
        Err(_) => error_response("Invalid JSON body"),
    }
}

// ---------------- Helpers ----------------

fn json_response<T: Serialize>(data: &T) -> HttpUpdateResponse<'static> {
    HttpResponse::builder()
        .with_body(serde_json::to_vec(data).unwrap_or_else(|_| b"{}".to_vec()))
        .build_update()
}

fn error_response(msg: &str) -> HttpUpdateResponse<'static> {
    HttpResponse::builder()
        .with_body(format!(r#"{{"error":"{}"}}"#, msg).into_bytes())
        .build_update()
}

// export_candid!();

// Enable Candid export
ic_cdk::export_candid!();
