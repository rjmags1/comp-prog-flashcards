use std::collections::{ HashMap, HashSet };
use std::error::Error;

use diesel::connection::SimpleConnection;
use diesel::sqlite::SqliteConnection;
use diesel::{ prelude::*, insert_into };
use crate::schema;
use crate::schema::CardBack::card;

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

pub fn update_deck(
    deck_id: i32,
    name: String,
    size: i32,
    mastered: i32
) -> Result<DeckData, Box<dyn Error>> {
    use schema::Deck;
    let conn = &mut establish_connection();

    diesel
        ::update(Deck::table.filter(Deck::id.eq(deck_id)))
        .set((
            Deck::name.eq(name),
            Deck::size.eq(size),
            Deck::mastered.eq(mastered),
        ))
        .execute(conn)?;
    let updated = &Deck::table.filter(Deck::id.eq(deck_id)).load::<DeckRow>(
        conn
    )?[0];

    Ok(DeckData {
        id: updated.0,
        name: updated.1.clone(),
        user: updated.2,
        size: updated.3,
        mastered: updated.4,
    })
}

pub fn delete_deck(deck_id: i32) -> Result<i32, Box<dyn Error>> {
    use schema::Deck;
    let conn = &mut establish_connection();

    diesel::delete(Deck::table.filter(Deck::id.eq(deck_id))).execute(conn)?;

    Ok(deck_id)
}

pub fn add_deck(name: String, user: i32) -> Result<DeckData, Box<dyn Error>> {
    use schema::Deck;
    let conn = &mut establish_connection();

    diesel
        ::insert_into(Deck::table)
        .values((Deck::name.eq(name), Deck::user.eq(user)))
        .execute(conn)?;
    let inserted = &Deck::table.order_by(Deck::id.desc())
        .limit(1)
        .load::<DeckRow>(conn)?[0];

    Ok(DeckData {
        id: inserted.0,
        name: inserted.1.clone(),
        user: inserted.2,
        size: inserted.3,
        mastered: inserted.4,
    })
}

#[derive(serde::Serialize, Debug)]
pub struct CardMetadata {
    pub id: i32,
    pub front: i32,
    pub back: i32,
    pub mastered: bool,
    pub source: Option<String>,
    pub shipped: bool,
    pub difficulty: String,
    pub tags: Vec<i32>,
}

type PartialCardMetadataRow = (
    i32,
    i32,
    i32,
    bool,
    Option<i32>,
    Option<String>,
    bool,
    Option<i32>,
);

#[derive(serde::Serialize, Debug)]
pub struct DeckCardsMetadata {
    pub deck_id: i32,
    pub deck_name: String,
    pub card_metadata: Vec<CardMetadata>,
}

pub fn load_deck_metadata(deck_id: i32) -> DeckCardsMetadata {
    use schema::{ Deck, Card_Deck, Card, Card_Tag, Source, DifficultyEnum };
    let conn = &mut establish_connection();

    let cards_tags = Deck::table.filter(Deck::id.eq(deck_id))
        .inner_join(Card_Deck::table)
        .inner_join(Card::table.on(Card::id.eq(Card_Deck::card)))
        .left_join(Card_Tag::table.on(Card_Tag::card.eq(Card::id)))
        .left_join(
            DifficultyEnum::table.on(
                DifficultyEnum::enum_val.eq(Card::difficulty)
            )
        )
        .select((
            Card::id,
            Card::front,
            Card::back,
            Card::mastered,
            Card::source.nullable(),
            DifficultyEnum::name.nullable(),
            Card::shipped,
            Card_Tag::tag.nullable(),
        ))
        .load::<PartialCardMetadataRow>(conn)
        .unwrap();
    let sources_vec = Source::table.load::<(i32, String)>(conn).unwrap();
    let mut sources: HashMap<i32, String> = HashMap::new();
    sources_vec.into_iter().for_each(|(id, name)| {
        sources.insert(id, name);
    });

    let mut card_metadata: Vec<CardMetadata> = vec![];
    let mut num_cards = 0;
    let mut prev_id: i32 = -1;
    for (
        id,
        front,
        back,
        mastered,
        source_id,
        difficulty,
        shipped,
        tag,
    ) in cards_tags.iter() {
        if *id != prev_id {
            prev_id = *id;
            num_cards += 1;
            let mut new_card = CardMetadata {
                id: *id,
                front: *front,
                back: *back,
                mastered: *mastered,
                source: None,
                difficulty: difficulty.as_ref().unwrap().to_string(),
                shipped: *shipped,
                tags: vec![],
            };
            if let Some(source_id_) = source_id {
                new_card.source = Some(
                    sources.get(source_id_).unwrap().to_string()
                );
            }
            card_metadata.push(new_card);
        }
        if let Some(tag_id) = tag {
            card_metadata[num_cards - 1].tags.push(*tag_id);
        }
    }

    let deck_name = Deck::table.filter(Deck::id.eq(deck_id))
        .select(Deck::name)
        .first::<String>(conn)
        .unwrap();

    DeckCardsMetadata {
        deck_id,
        deck_name,
        card_metadata,
    }
}

#[derive(serde::Serialize, Debug)]
pub struct CardContentData {
    card_id: i32,
    title: String,
    prompt: String,
    notes: String,
    solutions: Vec<SolutionData>,
}

#[derive(serde::Serialize, Debug)]
pub struct SolutionData {
    id: i32,
    content: String,
    name: String,
}

pub fn load_card(
    card_id: i32,
    card_front_id: i32,
    card_back_id: i32
) -> CardContentData {
    use schema::{ CardFront, CardBack, Solution };
    let conn = &mut establish_connection();

    let (prompt, title) = CardFront::table.filter(
        CardFront::id.eq(card_front_id)
    )
        .select((CardFront::prompt, CardFront::title))
        .first::<(String, String)>(conn)
        .unwrap();

    let notes = CardBack::table.filter(CardBack::id.eq(card_back_id))
        .select(CardBack::notes)
        .first::<String>(conn)
        .unwrap();

    let solutions: Vec<SolutionData> = Solution::table.filter(
        Solution::cardback.eq(card_back_id)
    )
        .select((Solution::id, Solution::name, Solution::content))
        .load::<(i32, String, String)>(conn)
        .unwrap()
        .into_iter()
        .map(|(id, name, content)| SolutionData { id, name, content })
        .collect();

    CardContentData { card_id, title, prompt, notes, solutions }
}