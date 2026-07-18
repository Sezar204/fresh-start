use crate::server;

#[tauri::command]
pub fn start_backend_cmd() {
    server::start_backend();
}

#[tauri::command]
pub fn stop_backend_cmd() {
    server::stop_backend();
}

#[tauri::command]
pub async fn check_backend_health() -> bool {
    server::wait_for_backend().await
}

#[tauri::command]
pub fn get_app_data_path() -> String {
    "EMICP_DATA".to_string()
}
