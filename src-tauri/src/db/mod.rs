use std::collections::HashMap;
use std::error::Error;

use diesel::connection::SimpleConnection;
use diesel::sqlite::SqliteConnection;
use diesel::{ prelude::*, insert_into, update, delete };
use crate::schema;

const DATABASE_URL: &str = "sqlite://cpf.db";

pub fn establish_connection(disable_fk: bool) -> SqliteConnection {
    let mut conn = SqliteConnection::establish(DATABASE_URL).unwrap_or_else(|_|
        panic!("Error connecting to database")
    );
    if !disable_fk {
        conn.batch_execute("PRAGMA foreign_keys = ON").expect(
            "fk pragma failed"
        );
    }
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
pub struct TagData {
    pub id: i32,
    pub tag_type: String,
    pub name: String,
    pub content: Option<String>,
}

#[derive(serde::Serialize)]
pub struct AppContextDbData {
    pub themes: Vec<String>,
    pub users: Vec<UserData>,
    pub tags: Vec<TagData>,
    pub sources: Vec<SourceData>,
}

#[derive(serde::Serialize)]
pub struct SourceData {
    pub id: i32,
    pub name: String,
}

type ThemeEnumRow = (i32, String);
type UserInfoRow = (i32, String, i32, bool, Option<String>, Option<String>);
type TagRow = (i32, String, Option<String>, Option<String>);
type SourceRow = (i32, String);

pub fn load_app_context() -> AppContextDbData {
    use schema::{ ThemeEnum, User, Image, Tag, TagTypeEnum, Source };
    let conn = &mut establish_connection(false);

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
    let source_rows = Source::table.load::<SourceRow>(conn).unwrap();

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
            name: row.1,
            content: row.2,
            tag_type: row.3.unwrap(),
        })
        .collect();
    let sources: Vec<SourceData> = source_rows
        .into_iter()
        .map(|row| SourceData {
            id: row.0,
            name: row.1,
        })
        .collect();

    AppContextDbData { themes, users, tags, sources }
}

pub fn add_user(
    username: String,
    default_avatar: bool,
    avatar_path: String,
    avatar_name: String,
    prefill_deck: bool
) -> Result<UserData, Box<dyn Error>> {
    let conn = &mut establish_connection(false);
    use schema::{ User, Deck, Image, Card, Card_Deck };

    conn.transaction(|conn| {
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
    let conn = &mut establish_connection(false);

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
    let conn = &mut establish_connection(false);

    update(Deck::table.filter(Deck::id.eq(deck_id)))
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
    let conn = &mut establish_connection(false);

    delete(Deck::table.filter(Deck::id.eq(deck_id))).execute(conn)?;

    Ok(deck_id)
}

pub fn add_deck(name: String, user: i32) -> Result<DeckData, Box<dyn Error>> {
    use schema::Deck;
    let conn = &mut establish_connection(false);

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
    let conn = &mut establish_connection(false);

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
    let conn = &mut establish_connection(false);

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

type CardRow = (i32, i32, i32, bool, Option<i32>, bool, i32);

pub fn add_card(
    title: String,
    source_id: Option<i32>,
    source_name: Option<String>,
    difficulty: String,
    deck_id: i32
) -> Result<CardMetadata, Box<dyn Error>> {
    use schema::{ Card, DifficultyEnum, CardFront, CardBack, Deck, Card_Deck };
    let conn = &mut establish_connection(true);

    conn.transaction(|conn| {
        let new_card_id: i32 =
            Card::table.select(Card::id)
                .order_by(Card::id.desc())
                .limit(1)
                .load::<i32>(conn)?[0] + 1;
        let card_front_id: i32 =
            CardFront::table.select(CardFront::id)
                .order_by(CardFront::id.desc())
                .limit(1)
                .load::<i32>(conn)?[0] + 1;
        let card_back_id: i32 =
            CardBack::table.select(CardBack::id)
                .order_by(CardBack::id.desc())
                .limit(1)
                .load::<i32>(conn)?[0] + 1;
        let difficulty_id: i32 = DifficultyEnum::table.filter(
            DifficultyEnum::name.eq(&difficulty)
        )
            .select(DifficultyEnum::enum_val)
            .first(conn)?;

        insert_into(CardFront::table)
            .values((
                CardFront::title.eq(title),
                CardFront::card.eq(new_card_id),
                CardFront::prompt.eq(""),
            ))
            .execute(conn)?;
        insert_into(CardBack::table)
            .values((CardBack::card.eq(new_card_id), CardBack::notes.eq("")))
            .execute(conn)?;
        insert_into(Card::table)
            .values((
                Card::front.eq(card_front_id),
                Card::back.eq(card_back_id),
                Card::source.eq(source_id),
                Card::difficulty.eq(difficulty_id),
            ))
            .execute(conn)?;
        insert_into(Card_Deck::table)
            .values((
                Card_Deck::card.eq(new_card_id),
                Card_Deck::deck.eq(deck_id),
            ))
            .execute(conn)?;
        update(Deck::table.filter(Deck::id.eq(deck_id)))
            .set(Deck::size.eq(Deck::size + 1))
            .execute(conn)?;

        let inserted_card_row = Card::table.filter(
            Card::id.eq(new_card_id)
        ).first::<CardRow>(conn)?;

        Ok(CardMetadata {
            id: inserted_card_row.0,
            front: inserted_card_row.1,
            back: inserted_card_row.2,
            mastered: inserted_card_row.3,
            source: source_name,
            shipped: inserted_card_row.5,
            difficulty,
            tags: vec![],
        })
    })
}

pub fn load_card_titles(deck_id: i32) -> Vec<(i32, String)> {
    use schema::{ CardFront, Card_Deck };
    let conn = &mut establish_connection(false);

    Card_Deck::table.filter(Card_Deck::deck.eq(deck_id))
        .inner_join(CardFront::table.on(CardFront::card.eq(Card_Deck::card)))
        .select((CardFront::card, CardFront::title))
        .load::<(i32, String)>(conn)
        .unwrap()
}

pub fn add_card_to_decks(
    card_id: i32,
    deck_ids: Vec<i32>
) -> Result<(), Box<dyn Error>> {
    use schema::Card_Deck;
    let conn = &mut establish_connection(false);

    let insert_rows: Vec<_> = deck_ids
        .into_iter()
        .map(|deck_id| (
            Card_Deck::card.eq(card_id),
            Card_Deck::deck.eq(deck_id),
        ))
        .collect();
    insert_into(Card_Deck::table).values(insert_rows).execute(conn)?;

    Ok(())
}

pub fn load_card_decks(card_id: i32) -> Vec<i32> {
    use schema::Card_Deck;
    let conn = &mut establish_connection(false);

    Card_Deck::table.filter(Card_Deck::card.eq(card_id))
        .select(Card_Deck::deck)
        .load::<i32>(conn)
        .unwrap()
}

pub fn delete_card_from_deck(
    card_id: i32,
    deck_id: i32
) -> Result<i32, Box<dyn Error>> {
    use schema::{ Card_Deck, Card };
    let conn = &mut establish_connection(false);

    conn.transaction(|conn| {
        let num_decks: i32 = Card_Deck::table.filter(
            Card_Deck::card.eq(card_id)
        )
            .select(Card_Deck::deck)
            .load::<i32>(conn)?
            .len() as i32;

        if num_decks == 1 {
            delete(Card::table.filter(Card::id.eq(card_id))).execute(conn)?;
        } else {
            delete(
                Card_Deck::table.filter(Card_Deck::card.eq(card_id)).filter(
                    Card_Deck::deck.eq(deck_id)
                )
            ).execute(conn)?;
        }

        Ok(card_id)
    })
}

pub fn update_card_mastery(
    card_id: i32,
    status: bool
) -> Result<bool, Box<dyn Error>> {
    use schema::Card;
    let conn = &mut establish_connection(false);

    update(Card::table.filter(Card::id.eq(card_id)))
        .set(Card::mastered.eq(status))
        .execute(conn)?;

    Ok(status)
}

pub fn add_tags_to_card(
    card_id: i32,
    tag_ids: Vec<i32>
) -> Result<(), Box<dyn Error>> {
    use schema::Card_Tag;
    let conn = &mut establish_connection(false);

    let insert_rows: Vec<_> = tag_ids
        .into_iter()
        .map(|tag_id| (Card_Tag::card.eq(card_id), Card_Tag::tag.eq(tag_id)))
        .collect();
    insert_into(Card_Tag::table).values(insert_rows).execute(conn)?;

    Ok(())
}

pub fn add_tag(
    tag_type: String,
    name: String,
    content: Option<String>
) -> Result<TagData, Box<dyn Error>> {
    use schema::{ TagTypeEnum, Tag };
    let conn = &mut establish_connection(false);

    let tag_type_enum_val = TagTypeEnum::table.filter(
        TagTypeEnum::name.eq(&tag_type)
    )
        .select(TagTypeEnum::enum_val)
        .load::<i32>(conn)?[0];
    insert_into(Tag::table)
        .values((
            Tag::type_.eq(tag_type_enum_val),
            Tag::name.eq(name),
            Tag::content.eq(content),
        ))
        .execute(conn)?;
    let (id, name, content): (i32, String, Option<String>) = Tag::table.select((
        Tag::id,
        Tag::name,
        Tag::content.nullable(),
    ))
        .order_by(Tag::id.desc())
        .limit(1)
        .first(conn)?;

    Ok(TagData {
        id,
        name,
        content,
        tag_type,
    })
}