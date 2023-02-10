use diesel::sqlite::SqliteConnection;
use diesel::{prelude::*};

const DATABASE_URL: &str = "sqlite://cpf.db";

pub fn establish_connection() -> SqliteConnection {
    SqliteConnection::establish(DATABASE_URL)
        .unwrap_or_else(|_| panic!("Error connecting to database"))
}