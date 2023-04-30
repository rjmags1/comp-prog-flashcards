use super::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{ embed_migrations, EmbeddedMigrations };
use crate::schema;

// general plan
//   - write establish_test_connection fn using ":memory:" sqlite db
//   - fill temp db with mock data
//   - test db fetchers using mock data

const TEST_DB_URL: &str = ":memory:";
const TEST_MIGRATIONS: EmbeddedMigrations = embed_migrations!(
    "./src/db/test_migrations"
);

enum PreDefTagType {
    Paradigm,
    Concept,
    Trick,
}

enum PreDefThemeType {
    Normal,
    Dark,
}

fn init_test_db() -> Result<
    SqliteConnection,
    Box<dyn Error + Send + Sync + 'static>
> {
    let mut conn = SqliteConnection::establish(TEST_DB_URL)?; // in memory sqlite db
    conn.run_pending_migrations(TEST_MIGRATIONS)?; // just define empty entities
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

fn insert_test_user(
    username: String,
    avatar_id: i32,
    theme_id: i32,
    tagmask: i32,
    hidediffs: bool
) -> Result<(), Box<dyn Error>> {
    Ok(())
}

fn insert_test_source(name: String) -> Result<(), Box<dyn Error>> {
    panic!();
}

#[test]
fn test_load_app_context() {
    // should load all user ids, names, tagmasks, hidediffs, avatar_path, their theme names
    // should load all tag ids, type names, names, content
    // should load all theme names
    // should load all source id and names
    let conn = &mut init_test_db().unwrap();
    let test_image_path_1 = "test_path_1".to_string();
    let test_image_path_2 = "test_path_2".to_string();
    insert_test_image(
        conn,
        "test_name".to_string(),
        test_image_path_1
    ).unwrap();
    insert_test_image(
        conn,
        "test_name".to_string(),
        test_image_path_2
    ).unwrap();

    let test_tag_name_1 = "test_tag_1".to_string();
    let test_tag_name_2 = "test_tag_2".to_string();
    let test_tag_type_1 = PreDefTagType::Concept;
    let test_tag_type_2 = PreDefTagType::Paradigm;
    let test_tag_content_1 = Some("test content".to_string());
    let test_tag_content_2: Option<String> = None;
    insert_test_tag(
        conn,
        test_tag_type_1,
        test_tag_name_1,
        test_tag_content_1
    ).unwrap();
    insert_test_tag(
        conn,
        test_tag_type_2,
        test_tag_name_2,
        test_tag_content_2
    ).unwrap();
}