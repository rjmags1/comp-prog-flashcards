// prevent command prompt window popup on windows
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use app::database;
use diesel::connection::SimpleConnection;

fn main() {
    let mut conn = database::establish_connection();
    conn.batch_execute("PRAGMA foreign_keys = ON").expect("fk pragma failed");

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
