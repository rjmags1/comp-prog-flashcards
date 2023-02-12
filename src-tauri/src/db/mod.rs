use std::error::Error;

use diesel::connection::SimpleConnection;
use diesel::sqlite::SqliteConnection;
use diesel::{ prelude::*, insert_into };
use crate::schema;

const DATABASE_URL: &str = "sqlite://cpf.db";

pub fn establish_connection() -> SqliteConnection {
    let mut conn = SqliteConnection::establish(DATABASE_URL).unwrap_or_else(|_|
        panic!("Error connecting to database")
    );
    conn.batch_execute("PRAGMA foreign_keys = ON").expect("fk pragma failed");
    let conn = conn;

    conn
}

#[derive(serde::Serialize)]
#[derive(Debug)]
pub struct UserData {
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
    use schema::{ ThemeEnum, User, Image, Tag, TagTypeEnum };
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
        .select((
            Tag::id,
            Tag::name,
            Tag::content,
            TagTypeEnum::name.nullable(),
        ))
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

pub fn add_user(
    username: String,
    default_avatar: bool,
    avatar_path: String,
    avatar_name: String,
    prefill_deck: bool
) -> Result<UserData, Box<dyn Error>> {
    let conn = &mut establish_connection();
    use schema::{ User, Deck, Image, Card, Card_Deck };

    let mut avatar_id = 1;
    if !default_avatar {
        insert_into(Image::table)
            .values((
                Image::name.eq(&avatar_name),
                Image::path.eq(&avatar_path),
            ))
            .execute(conn)?;
        avatar_id = Image::table.select(Image::id)
            .order(Image::id.desc())
            .limit(1)
            .load::<i32>(conn)
            .unwrap()[0];
    }

    insert_into(User::table)
        .values((User::username.eq(&username), User::avatar.eq(avatar_id)))
        .execute(conn)?;
    let user_id = User::table.select(User::id)
        .order(User::id.desc())
        .limit(1)
        .load(conn)
        .unwrap()[0];

    if prefill_deck {
        insert_into(Deck::table)
            .values((Deck::name.eq("Deck 1"), Deck::user.eq(user_id)))
            .execute(conn)?;
        let deck_id = Deck::table.select(Deck::id)
            .order(Deck::id.desc())
            .limit(1)
            .load::<i32>(conn)
            .unwrap()[0];

        let shipped_card_ids = Card::table.filter(Card::shipped.eq(true))
            .select(Card::id)
            .load::<i32>(conn)
            .unwrap();
        let mut card_deck_rows = vec![(
            Card_Deck::card.eq(shipped_card_ids[0]),
            Card_Deck::deck.eq(deck_id),
        )];
        for i in 1..shipped_card_ids.len() {
            card_deck_rows.push((
                Card_Deck::card.eq(shipped_card_ids[i]),
                Card_Deck::deck.eq(deck_id),
            ));
        }
        insert_into(Card_Deck::table).values(card_deck_rows).execute(conn)?;
    }

    Ok(UserData {
        id: user_id,
        username,
        avatar_path,
        theme: String::from("Normal"),
        tagmask: 0,
        hidediffs: false,
    })
}

#[derive(serde::Serialize)]
pub struct DeckData {
    pub id: i32,
    pub name: String,
    pub user: i32,
    pub size: i32,
    pub mastered: i32,
}

#[derive(serde::Serialize)]
pub struct UserDecksData {
    pub decks: Vec<DeckData>,
}

type DeckRow = (i32, String, i32, i32, i32);

pub fn load_user_decks(user_id: i32) -> UserDecksData {
    use schema::Deck;
    let conn = &mut establish_connection();

    let user_decks = Deck::table.filter(Deck::user.eq(user_id))
        .load::<DeckRow>(conn)
        .unwrap();

    UserDecksData {
        decks: user_decks
            .into_iter()
            .map(|row| DeckData {
                id: row.0,
                name: row.1,
                user: row.2,
                size: row.3,
                mastered: row.4,
            })
            .collect(),
    }
}