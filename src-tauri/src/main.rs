// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod server;

fn main() {
    server::start_backend();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::start_backend_cmd,
            commands::stop_backend_cmd,
            commands::check_backend_health,
            commands::get_app_data_path
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                server::stop_backend();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
