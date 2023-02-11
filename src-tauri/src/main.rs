// prevent command prompt window popup on windows
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use app::database;
use diesel::connection::SimpleConnection;

#[tauri::command]
fn load_app_context() -> database::AppContextDbData {
    database::load_app_context()
}

fn main() {
    let conn = &mut database::establish_connection();
    conn.batch_execute("PRAGMA foreign_keys = ON").expect("fk pragma failed");

    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![load_app_context])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}