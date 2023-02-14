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

#[tauri::command]
fn load_user_decks(user_id: i32) -> database::UserDecksData {
    database::load_user_decks(user_id)
}

#[tauri::command]
fn load_card_decks(card_id: i32) -> Vec<i32> {
    database::load_card_decks(card_id)
}

#[tauri::command]
fn update_deck(
    deck_id: i32,
    name: String,
    size: i32,
    mastered: i32
) -> Result<database::DeckData, String> {
    let update_result = database::update_deck(deck_id, name, size, mastered);
    match update_result {
        Ok(updated_deck) => Ok(updated_deck),
        Err(e) => Err(format!("Deck update failure: {}", e)),
    }
}

#[tauri::command]
fn delete_deck(deck_id: i32) -> Result<i32, String> {
    let delete_result = database::delete_deck(deck_id);
    match delete_result {
        Ok(deleted_id) => Ok(deleted_id),
        Err(e) => Err(format!("Deck delete failure: {}", e)),
    }
}

#[tauri::command]
fn add_deck(name: String, user: i32) -> Result<database::DeckData, String> {
    let add_result = database::add_deck(name, user);

    match add_result {
        Ok(added_deck) => Ok(added_deck),
        Err(e) => Err(format!("Deck add failure: {}", e)),
    }
}

#[tauri::command]
fn load_card_metadata(deck_id: i32) -> database::DeckCardsMetadata {
    database::load_deck_metadata(deck_id)
}

#[tauri::command]
fn load_card(
    card_id: i32,
    card_front_id: i32,
    card_back_id: i32
) -> database::CardContentData {
    database::load_card(card_id, card_front_id, card_back_id)
}

#[tauri::command]
fn add_card(
    title: String,
    source_id: Option<i32>,
    source_name: Option<String>,
    difficulty: String,
    deck_id: i32
) -> Result<database::CardMetadata, String> {
    let add_result = database::add_card(
        title,
        source_id,
        source_name,
        difficulty,
        deck_id
    );

    match add_result {
        Ok(card_metadata) => Ok(card_metadata),
        Err(e) => Err(format!("Card add failure: {}", e)),
    }
}

#[tauri::command]
fn load_card_titles(deck_id: i32) -> Vec<(i32, String)> {
    database::load_card_titles(deck_id)
}

#[tauri::command]
fn add_card_to_deck(card_id: i32, deck_ids: Vec<i32>) -> Result<(), String> {
    let add_result = database::add_card_to_deck(card_id, deck_ids);

    match add_result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Card deck association failure: {}", e)),
    }
}

#[tauri::command]
fn delete_card_from_deck(card_id: i32, deck_id: i32) -> Result<i32, String> {
    let delete_result = database::delete_card_from_deck(card_id, deck_id);

    match delete_result {
        Ok(deleted_id) => Ok(deleted_id),
        Err(e) => Err(format!("Card delete failure: {}", e)),
    }
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(
            tauri::generate_handler![
                load_app_context,
                add_user,
                load_user_decks,
                update_deck,
                delete_deck,
                add_deck,
                load_card_metadata,
                load_card,
                add_card,
                load_card_titles,
                add_card_to_deck,
                load_card_decks,
                delete_card_from_deck
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}