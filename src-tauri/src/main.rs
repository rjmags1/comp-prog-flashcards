// don't cause command prompt window popup on windows
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use diesel::connection::SimpleConnection;
use diesel::sqlite::SqliteConnection;
use diesel::{prelude::*, insert_into};
use dotenvy::dotenv;
use std::env;
pub mod schema;
pub mod models;

fn main() {
    use self::schema::Card_Deck::dsl::*;

    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let mut conn = SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url));
    conn.batch_execute("PRAGMA foreign_keys = ON").expect("fk pragma failed");
    let result: Vec<(i32, i32, i32)> = Card_Deck.load(&mut conn).expect("test query failure");
    let rows = result.len();
    println!("{}", rows); // zero rows
    let new_row = (rel_id.eq(1), card.eq(1), card.eq(1));
    insert_into(Card_Deck)
        .values(&new_row)
        .execute(&mut conn)
        .expect("fails if fk constraints on"); // the pragma worked!

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
