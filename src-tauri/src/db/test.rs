use super::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{ embed_migrations, FileBasedMigrations };
use crate::schema;

// general plan
//   - write establish_test_connection fn using ":memory:" sqlite db
//   - fill temp db with mock data
//   - test db fetchers using mock data

const TEST_DB_URL: &str = ":memory:";
const TEST_EMBEDDED_MIGRATIONS: EmbeddedMigrations = embed_migrations!(
    "./src/db/test_migrations/embedded"
);
const TEST_DECK_PREFILL_MIGRATION_PATH: &str =
    "./src/db/test_migrations/file_based/deck_prefill";
const PRE_DEF_TAG_TYPE_NAMES: &[&str] = &["Paradigm", "Concept", "Trick"];
const PRE_DEF_THEME_TYPE_NAMES: &[&str] = &["Normal", "Dark"];
const TEST_MIGRATION_PREFILL_DECK_NAME: &str = "test_lc_deck";
const DEFAULT_PREFILL_DECK_NAME: &str = "Deck 1";
const TEST_PREFILL_DECK_SIZE: i32 = 2547;

enum PreDefTagType {
    Paradigm = 1,
    Concept = 2,
    Trick = 3,
}

enum PreDefThemeType {
    Normal = 1,
    Dark = 2,
}

fn init_test_db() -> Result<
    SqliteConnection,
    Box<dyn Error + Send + Sync + 'static>
> {
    let mut conn = SqliteConnection::establish(TEST_DB_URL)?; // in memory sqlite db
    conn.run_pending_migrations(TEST_EMBEDDED_MIGRATIONS)?; // just define empty entities
    let conn = conn;
    Ok(conn)
}

fn insert_test_image(
    conn: &mut SqliteConnection,
    name: String,
    path: String
) -> Result<(), Box<dyn Error>> {
    use schema::Image;
    insert_into(Image::table)
        .values((Image::name.eq(&name), Image::path.eq(&path)))
        .execute(conn)?;
    Ok(())
}

fn wipe_test_images(conn: &mut SqliteConnection) -> Result<(), Box<dyn Error>> {
    use schema::Image;
    delete(Image::table).filter(Image::id.gt(1)).execute(conn)?;
    Ok(())
}

fn insert_test_tag(
    conn: &mut SqliteConnection,
    tag_type: PreDefTagType,
    name: String,
    content: Option<String>
) -> Result<(), Box<dyn Error>> {
    use schema::Tag;
    let tag_type_id = match tag_type {
        PreDefTagType::Paradigm => 1,
        PreDefTagType::Concept => 2,
        PreDefTagType::Trick => 3,
    };
    insert_into(Tag::table)
        .values((
            Tag::type_.eq(tag_type_id),
            Tag::name.eq(name),
            Tag::content.eq(content),
        ))
        .execute(conn)?;
    Ok(())
}

fn wipe_test_tags(conn: &mut SqliteConnection) -> Result<(), Box<dyn Error>> {
    use schema::Tag;
    delete(Tag::table).execute(conn)?;
    Ok(())
}

fn insert_test_user(
    conn: &mut SqliteConnection,
    username: String,
    avatar_id: Option<i32>,
    theme_id: PreDefThemeType,
    tagmask: i32,
    hidediffs: bool
) -> Result<(), Box<dyn Error>> {
    use schema::User;
    insert_into(User::table)
        .values((
            User::username.eq(username),
            User::avatar.eq(avatar_id),
            User::theme.eq(theme_id as i32),
            User::tagmask.eq(tagmask),
            User::hidediffs.eq(hidediffs),
        ))
        .execute(conn)?;
    Ok(())
}

fn wipe_test_users(conn: &mut SqliteConnection) -> Result<(), Box<dyn Error>> {
    use schema::User;
    delete(User::table).execute(conn)?;
    Ok(())
}

fn insert_test_source(
    conn: &mut SqliteConnection,
    name: String
) -> Result<(), Box<dyn Error>> {
    use schema::Source;
    insert_into(Source::table).values(Source::name.eq(name)).execute(conn)?;
    Ok(())
}

fn wipe_test_sources(
    conn: &mut SqliteConnection
) -> Result<(), Box<dyn Error>> {
    use schema::Source;
    delete(Source::table).execute(conn)?;
    Ok(())
}

fn wipe_test_data(conn: &mut SqliteConnection) -> Result<(), Box<dyn Error>> {
    wipe_test_images(conn)?;
    wipe_test_tags(conn)?;
    wipe_test_users(conn)?;
    wipe_test_sources(conn)?;
    Ok(())
}

#[test]
fn test_load_app_context() {
    let mut conn = init_test_db().unwrap();
    wipe_test_data(&mut conn).unwrap();
    let test_image_path_1 = "test_path_1".to_string();
    let test_image_path_2 = "test_path_2".to_string();
    insert_test_image(
        &mut conn,
        "test_image_1".to_string(),
        test_image_path_1.clone()
    ).unwrap();
    insert_test_image(
        &mut conn,
        "test_image_2".to_string(),
        test_image_path_2.clone()
    ).unwrap();

    let test_tag_data_1 = TagData {
        id: 1,
        tag_type: PRE_DEF_TAG_TYPE_NAMES[
            (PreDefTagType::Paradigm as usize) - 1
        ].to_string(),
        name: "test_tag_1".to_string(),
        content: Some("test content".to_string()),
    };
    let test_tag_data_2 = TagData {
        id: 2,
        tag_type: PRE_DEF_TAG_TYPE_NAMES[
            (PreDefTagType::Concept as usize) - 1
        ].to_string(),
        name: "test_tag_2".to_string(),
        content: None,
    };

    insert_test_tag(
        &mut conn,
        PreDefTagType::Paradigm,
        test_tag_data_1.name.clone(),
        test_tag_data_1.content.clone()
    ).unwrap();
    insert_test_tag(
        &mut conn,
        PreDefTagType::Concept,
        test_tag_data_2.name.clone(),
        test_tag_data_2.content.clone()
    ).unwrap();

    let test_user_data_1 = UserData {
        id: 1,
        username: "test_user_1".to_string(),
        avatar_path: test_image_path_1,
        theme: PRE_DEF_THEME_TYPE_NAMES[
            (PreDefThemeType::Normal as usize) - 1
        ].to_string(),
        tagmask: 0,
        hidediffs: true,
    };
    let test_user_data_2 = UserData {
        id: 2,
        username: "test_user_2".to_string(),
        avatar_path: test_image_path_2,
        theme: PRE_DEF_THEME_TYPE_NAMES[
            (PreDefThemeType::Dark as usize) - 1
        ].to_string(),
        tagmask: 2,
        hidediffs: false,
    };
    insert_test_user(
        &mut conn,
        test_user_data_1.username.clone(),
        Some(2), // default image id is 1, so test_image_1 will have id 2
        PreDefThemeType::Normal,
        test_user_data_1.tagmask,
        test_user_data_1.hidediffs
    ).unwrap();
    insert_test_user(
        &mut conn,
        test_user_data_2.username.clone(),
        Some(3), // default image id is 1, so test_image_2 will have id 3
        PreDefThemeType::Dark,
        2,
        false
    ).unwrap();

    let test_source_data_1 = SourceData {
        id: 1,
        name: "test_source_1".to_string(),
    };
    let test_source_data_2 = SourceData {
        id: 2,
        name: "test_source_2".to_string(),
    };
    insert_test_source(&mut conn, test_source_data_1.name.clone()).unwrap();
    insert_test_source(&mut conn, test_source_data_2.name.clone()).unwrap();

    let test_app_context_data = load_app_context(Some(conn));
    assert_eq!(test_app_context_data.themes, PRE_DEF_THEME_TYPE_NAMES.to_vec());
    assert_eq!(
        test_app_context_data.users,
        vec![test_user_data_1, test_user_data_2]
    );
    assert_eq!(
        test_app_context_data.tags,
        vec![test_tag_data_1, test_tag_data_2]
    );
    assert_eq!(
        test_app_context_data.sources,
        vec![test_source_data_1, test_source_data_2]
    );
}

fn insert_test_preshipped_lc_deck_cards(
    mut conn: SqliteConnection
) -> Result<SqliteConnection, Box<dyn Error + Send + Sync>> {
    let m = FileBasedMigrations::from_path(
        TEST_DECK_PREFILL_MIGRATION_PATH
    ).unwrap();
    conn.run_pending_migrations(m).unwrap();
    Ok(conn)
}

#[test]
fn test_add_user() {
    use schema::{ User, Deck };
    let mut conn = init_test_db().unwrap();
    wipe_test_data(&mut conn).unwrap();
    let mut conn = insert_test_preshipped_lc_deck_cards(conn).unwrap();
    let test_image_name_1 = "test_image_1".to_string();
    let test_image_path_1 = "test_path_1".to_string();

    let test_user_data_1 = UserData {
        id: 1,
        username: "test_user_1".to_string(),
        avatar_path: test_image_path_1.clone(),
        theme: PRE_DEF_THEME_TYPE_NAMES[
            (PreDefThemeType::Normal as usize) - 1
        ].to_string(),
        tagmask: 0,
        hidediffs: false,
    };
    let test_user_data_2 = UserData {
        id: 2,
        username: "test_user_2".to_string(),
        avatar_path: DEFAULT_IMAGE_PATH.to_string(),
        theme: PRE_DEF_THEME_TYPE_NAMES[
            (PreDefThemeType::Normal as usize) - 1
        ].to_string(),
        tagmask: 0,
        hidediffs: false,
    };

    let initial_decks = Deck::table.select((
        Deck::name,
        Deck::user,
        Deck::size,
        Deck::mastered,
    ))
        .load::<(String, i32, i32, i32)>(&mut conn)
        .unwrap();

    let ret_1 = add_user(
        &mut conn,
        test_user_data_1.username.clone(),
        false,
        test_image_path_1.clone(),
        test_image_name_1.clone(),
        false
    ).unwrap();
    let ret_2 = add_user(
        &mut conn,
        test_user_data_2.username.clone(),
        true,
        "".to_string(),
        "".to_string(),
        true
    ).unwrap();
    let users = User::table.select((
        User::username,
        User::avatar.nullable(),
        User::theme,
        User::tagmask,
        User::hidediffs,
    ))
        .load::<(String, Option<i32>, i32, i32, bool)>(&mut conn)
        .unwrap();
    let added_row_1 = &users[0];
    let added_row_2 = &users[1];
    let inserted_decks = Deck::table.select((
        Deck::name,
        Deck::user,
        Deck::size,
        Deck::mastered,
    ))
        .load::<(String, i32, i32, i32)>(&mut conn)
        .unwrap();

    assert_eq!(added_row_1.0, test_user_data_1.username);
    assert_eq!(added_row_1.1.unwrap(), 2);
    assert_eq!(added_row_1.2, 1);
    assert_eq!(added_row_1.3, 0);
    assert_eq!(added_row_1.4, false);
    assert_eq!(test_user_data_1, ret_1);

    assert_eq!(added_row_2.0, test_user_data_2.username);
    assert_eq!(added_row_2.1.unwrap(), 1);
    assert_eq!(added_row_2.2, 1);
    assert_eq!(added_row_2.3, 0);
    assert_eq!(added_row_2.4, false);
    assert_eq!(test_user_data_2, ret_2);

    assert_eq!(initial_decks.len(), 1);
    assert_eq!(inserted_decks.len(), 2);
    assert_eq!(inserted_decks[1].0, DEFAULT_PREFILL_DECK_NAME.to_string());
    assert_eq!(inserted_decks[1].1, 2);
    assert_eq!(inserted_decks[1].2, TEST_PREFILL_DECK_SIZE);
    assert_eq!(inserted_decks[1].3, 0);
}

fn insert_test_deck(
    conn: &mut SqliteConnection,
    name: String,
    user: i32,
    test_cards: Option<Vec<i32>>
) -> Result<(), Box<dyn Error>> {
    use schema::{ Deck, Card_Deck };
    insert_into(Deck::table)
        .values((Deck::name.eq(name), Deck::user.eq(user)))
        .execute(conn)?;
    let deck_id: i32 = Deck::table.select(Deck::id)
        .order(Deck::id.desc())
        .first(conn)?;
    if let Some(cards) = test_cards {
        update(Deck::table)
            .filter(Deck::id.eq(deck_id))
            .set(Deck::size.eq(cards.len() as i32))
            .execute(conn)?;
        for card_id in cards {
            insert_into(Card_Deck::table)
                .values((
                    Card_Deck::card.eq(card_id),
                    Card_Deck::deck.eq(deck_id),
                ))
                .execute(conn)?;
        }
    }
    Ok(())
}

#[test]
fn test_load_user_decks() {
    // associate added decks with users
    // call load_user_decks on test users
    // assert on correct decks loaded, deck data
    let mut conn = init_test_db().unwrap();
    wipe_test_data(&mut conn).unwrap();

    insert_test_user(
        &mut conn,
        "test_user_1".to_string(),
        None,
        PreDefThemeType::Normal,
        0,
        false
    ).unwrap();
    insert_test_user(
        &mut conn,
        "test_user_2".to_string(),
        None,
        PreDefThemeType::Normal,
        0,
        false
    ).unwrap();

    let mut conn = insert_test_preshipped_lc_deck_cards(conn).unwrap();
    insert_test_deck(
        &mut conn,
        "test_deck_name_1".to_string(),
        1,
        Some(vec![1, 2])
    ).unwrap();
    insert_test_deck(
        &mut conn,
        "test_deck_name_2".to_string(),
        2,
        Some(vec![1, 2])
    ).unwrap();
    insert_test_deck(
        &mut conn,
        "test_deck_name_3".to_string(),
        2,
        Some(vec![3])
    ).unwrap();

    let user_1_decks = load_user_decks(1, &mut conn).decks;
    // hacky but test lc deck associated w/ user id 1 in file based migration
    assert_eq!(user_1_decks.len(), 2);
    assert_eq!(user_1_decks[0].name, TEST_MIGRATION_PREFILL_DECK_NAME);
    assert_eq!(user_1_decks[0].user, 1);
    assert_eq!(user_1_decks[0].size, TEST_PREFILL_DECK_SIZE);
    assert_eq!(user_1_decks[1].name, "test_deck_name_1".to_string());
    assert_eq!(user_1_decks[1].user, 1);
    assert_eq!(user_1_decks[1].size, 2);

    let user_2_decks = load_user_decks(2, &mut conn).decks;
    assert_eq!(user_2_decks.len(), 2);
    assert_eq!(user_2_decks[0].name, "test_deck_name_2".to_string());
    assert_eq!(user_2_decks[0].user, 2);
    assert_eq!(user_2_decks[0].size, 2);
    assert_eq!(user_2_decks[1].name, "test_deck_name_3".to_string());
    assert_eq!(user_2_decks[1].user, 2);
    assert_eq!(user_2_decks[1].size, 1);
}
