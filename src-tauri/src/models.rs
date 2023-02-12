#![allow(non_camel_case_types)]

use diesel::prelude::*;

#[derive(Queryable)]
pub struct Card_Deck {
    pub rel_id: i32,
    pub card: i32,
    pub deck: i32,
}