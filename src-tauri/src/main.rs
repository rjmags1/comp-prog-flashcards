// prevent command prompt window popup on windows
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use app::database;

#[tauri::command]
fn load_app_context() -> database::AppContextDbData {
    database::load_app_context()
}

#[tauri::command]
fn add_user(
    username: String,
    default_avatar: bool,
    avatar_path: String,
    avatar_name: String,
    prefill_deck: bool
) -> Result<database::UserData, String> {
    let add_result = database::add_user(
        username,
        default_avatar,
        avatar_path,
        avatar_name,
        prefill_deck
    );
    match add_result {
        Ok(user_data) => Ok(user_data),
        Err(e) => Err(format!("User add failure: {}", e)),
    }
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![load_app_context, add_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}