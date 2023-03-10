// @generated automatically by Diesel CLI.
#![allow(non_snake_case)]

diesel::table! {
    Card (id) {
        id -> Integer,
        front -> Integer,
        back -> Integer,
        mastered -> Bool,
        source -> Nullable<Integer>,
        shipped -> Bool,
        difficulty -> Integer,
    }
}

diesel::table! {
    CardBack (id) {
        id -> Integer,
        card -> Integer,
        notes -> Text,
    }
}

diesel::table! {
    CardFront (id) {
        id -> Integer,
        card -> Integer,
        prompt -> Text,
        title -> Text,
    }
}

diesel::table! {
    Card_Deck (rel_id) {
        rel_id -> Integer,
        card -> Integer,
        deck -> Integer,
    }
}

diesel::table! {
    Card_Tag (rel_id) {
        rel_id -> Integer,
        card -> Integer,
        tag -> Integer,
    }
}

diesel::table! {
    Deck (id) {
        id -> Integer,
        name -> Text,
        user -> Integer,
        size -> Integer,
        mastered -> Integer,
    }
}

diesel::table! {
    DifficultyEnum (enum_val) {
        enum_val -> Integer,
        name -> Text,
    }
}

diesel::table! {
    Image (id) {
        id -> Integer,
        name -> Text,
        path -> Text,
    }
}

diesel::table! {
    Solution (id) {
        id -> Integer,
        name -> Text,
        content -> Text,
        cardback -> Integer,
    }
}

diesel::table! {
    Source (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    Tag (id) {
        id -> Integer,
        #[sql_name = "type"]
        type_ -> Integer,
        name -> Text,
        content -> Nullable<Text>,
    }
}

diesel::table! {
    TagTypeEnum (enum_val) {
        enum_val -> Integer,
        name -> Text,
    }
}

diesel::table! {
    ThemeEnum (enum_val) {
        enum_val -> Integer,
        name -> Text,
    }
}

diesel::table! {
    User (id) {
        id -> Integer,
        username -> Text,
        avatar -> Nullable<Integer>,
        theme -> Integer,
        tagmask -> Integer,
        hidediffs -> Bool,
    }
}

diesel::joinable!(Card -> DifficultyEnum (difficulty));
diesel::joinable!(Card_Deck -> Card (card));
diesel::joinable!(Card_Deck -> Deck (deck));
diesel::joinable!(Card_Tag -> Card (card));
diesel::joinable!(Card_Tag -> Tag (tag));
diesel::joinable!(Deck -> User (user));
diesel::joinable!(Solution -> CardBack (cardback));
diesel::joinable!(Tag -> TagTypeEnum (type_));
diesel::joinable!(User -> Image (avatar));
diesel::joinable!(User -> ThemeEnum (theme));

diesel::allow_tables_to_appear_in_same_query!(
    Card,
    CardBack,
    CardFront,
    Card_Deck,
    Card_Tag,
    Deck,
    DifficultyEnum,
    Image,
    Solution,
    Source,
    Tag,
    TagTypeEnum,
    ThemeEnum,
    User
);