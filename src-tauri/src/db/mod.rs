use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use crate::schema;

const DATABASE_URL: &str = "sqlite://cpf.db";

pub fn establish_connection() -> SqliteConnection {
    SqliteConnection::establish(DATABASE_URL).unwrap_or_else(|_|
        panic!("Error connecting to database")
    )
}

#[derive(serde::Serialize)]
#[derive(Debug)]
struct UserData {
    pub id: i32,
    pub username: String,
    pub avatar_path: String,
    pub theme: String,
    pub tagmask: i32,
    pub hidediffs: bool,
}

#[derive(serde::Serialize)]
#[derive(Debug)]
struct TagData {
    pub id: i32,
    pub tag_type: String,
    pub name: String,
    pub content: Option<String>,
}

#[derive(serde::Serialize)]
pub struct AppContextDbData {
    themes: Vec<String>,
    users: Vec<UserData>,
    tags: Vec<TagData>,
}

type ThemeEnumRow = (i32, String);
type UserInfoRow = (i32, String, i32, bool, Option<String>, Option<String>);
type TagRow = (i32, Option<String>, Option<String>, Option<String>);

pub fn load_app_context() -> AppContextDbData {
    use schema::ThemeEnum;
    use schema::User;
    use schema::Image;
    use schema::Tag;
    use schema::TagTypeEnum;
    let conn = &mut establish_connection();

    let theme_rows = ThemeEnum::table.load::<ThemeEnumRow>(conn).unwrap();
    let user_rows = User::table.left_join(Image::table)
        .left_join(ThemeEnum::table)
        .select((
            User::id,
            User::username,
            User::tagmask,
            User::hidediffs,
            Image::path.nullable(),
            ThemeEnum::name.nullable(),
        ))
        .load::<UserInfoRow>(conn)
        .unwrap();
    let tag_rows = Tag::table.left_join(TagTypeEnum::table)
        .select((Tag::id, Tag::name, Tag::content, TagTypeEnum::name.nullable()))
        .load::<TagRow>(conn)
        .unwrap();

    let themes: Vec<String> = theme_rows
        .into_iter()
        .map(|row| row.1)
        .collect();
    let users: Vec<UserData> = user_rows
        .into_iter()
        .map(|row| UserData {
            id: row.0,
            username: row.1,
            tagmask: row.2,
            hidediffs: row.3,
            avatar_path: row.4.unwrap(),
            theme: row.5.unwrap(),
        })
        .collect();
    let tags: Vec<TagData> = tag_rows
        .into_iter()
        .map(|row| TagData {
            id: row.0,
            name: row.1.unwrap(),
            content: row.2,
            tag_type: row.3.unwrap(),
        })
        .collect();

    AppContextDbData { themes, users, tags }
}