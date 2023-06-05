// prevent command prompt window popup on windows
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use app::database::{ self, establish_connection };

#[tauri::command]
fn load_app_context() -> database::AppContextDbData {
    database::load_app_context(None)
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
        &mut database::establish_connection(false),
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
    database::load_user_decks(
        user_id,
        &mut database::establish_connection(false)
    )
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
    let update_result = database::update_deck(
        deck_id,
        name,
        size,
        mastered,
        &mut database::establish_connection(false)
    );
    match update_result {
        Ok(updated_deck) => Ok(updated_deck),
        Err(e) => Err(format!("Deck update failure: {}", e)),
    }
}

#[tauri::command]
fn delete_deck(deck_id: i32) -> Result<i32, String> {
    let delete_result = database::delete_deck(
        deck_id,
        &mut database::establish_connection(false)
    );
    match delete_result {
        Ok(deleted_id) => Ok(deleted_id),
        Err(e) => Err(format!("Deck delete failure: {}", e)),
    }
}

#[tauri::command]
fn add_deck(name: String, user: i32) -> Result<database::DeckData, String> {
    let add_result = database::add_deck(
        name,
        user,
        &mut database::establish_connection(false)
    );

    match add_result {
        Ok(added_deck) => Ok(added_deck),
        Err(e) => Err(format!("Deck add failure: {}", e)),
    }
}

#[tauri::command]
fn load_card_metadata(deck_id: i32) -> database::DeckCardsMetadata {
    database::load_deck_metadata(deck_id, &mut establish_connection(false))
}

#[tauri::command]
fn load_card(
    card_id: i32,
    card_front_id: i32,
    card_back_id: i32
) -> database::CardContentData {
    database::load_card(
        &mut establish_connection(false),
        card_id,
        card_front_id,
        card_back_id
    )
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
        deck_id,
        &mut establish_connection(false)
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
fn add_card_to_decks(card_id: i32, deck_ids: Vec<i32>) -> Result<(), String> {
    let add_result = database::add_card_to_decks(card_id, deck_ids);

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

#[tauri::command]
fn update_card_mastery(card_id: i32, status: bool) -> Result<bool, String> {
    let update_result = database::update_card_mastery(card_id, status);

    match update_result {
        Ok(new_status) => Ok(new_status),
        Err(e) => Err(format!("Card update failure: {}", e)),
    }
}

#[tauri::command]
fn add_tags_to_card(card_id: i32, tag_ids: Vec<i32>) -> Result<(), String> {
    let add_result = database::add_tags_to_card(card_id, tag_ids);

    match add_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Tags add failure: {}", e)),
    }
}

#[tauri::command]
fn add_tag(
    tag_type: String,
    name: String,
    content: Option<String>
) -> Result<database::TagData, String> {
    let add_result = database::add_tag(tag_type, name, content);

    match add_result {
        Ok(tag_data) => Ok(tag_data),
        Err(e) => Err(format!("Tag add failure: {}", e)),
    }
}

#[tauri::command]
fn delete_tag_from_card(card_id: i32, tag_id: i32) -> Result<(), String> {
    let delete_result = database::delete_tag_from_card(card_id, tag_id);

    match delete_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Delete tag failure: {}", e)),
    }
}

#[tauri::command]
fn update_card_prompt(
    card_front_id: i32,
    prompt: String
) -> Result<String, String> {
    let update_result = database::update_card_prompt(card_front_id, prompt);

    match update_result {
        Ok(updated_prompt) => Ok(updated_prompt),
        Err(e) => Err(format!("prompt update failure: {}", e)),
    }
}

#[tauri::command]
fn update_notes_or_solution_content(
    notes: bool,
    edited_id: i32,
    content: String
) -> Result<(), String> {
    let update_result = database::update_notes_or_solution_content(
        notes,
        edited_id,
        content
    );

    match update_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Tab update failure: {}", e)),
    }
}

#[tauri::command]
fn add_solution(
    name: String,
    content: String,
    card_back_id: i32
) -> Result<(), String> {
    let add_result = database::add_solution(name, content, card_back_id);

    match add_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Solution add failure: {}", e)),
    }
}

#[tauri::command]
fn update_theme(user_id: i32, theme: String) -> Result<(), String> {
    let update_result = database::update_theme(user_id, theme);

    match update_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Theme update failure: {}", e)),
    }
}

#[tauri::command]
fn update_hide_difficulty(user_id: i32, hidediffs: bool) -> Result<(), String> {
    let update_result = database::update_hide_difficulty(user_id, hidediffs);

    match update_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Difficulty settings update failure: {}", e)),
    }
}

#[tauri::command]
fn update_tag_mask(user_id: i32, tagmask: i32) -> Result<(), String> {
    let update_result = database::update_tag_mask(user_id, tagmask);

    match update_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Tag settings update failure: {}", e)),
    }
}

#[tauri::command]
fn delete_user(user_id: i32) -> Result<(), String> {
    let update_result = database::delete_user(user_id);

    match update_result {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("User delete failure: {}", e)),
    }
}

fn main() {
    database::run_migrations().expect("embedded migrations failed");

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
                add_card_to_decks,
                load_card_decks,
                delete_card_from_deck,
                update_card_mastery,
                add_tags_to_card,
                add_tag,
                delete_tag_from_card,
                update_card_prompt,
                update_notes_or_solution_content,
                add_solution,
                update_theme,
                update_hide_difficulty,
                update_tag_mask,
                delete_user
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
