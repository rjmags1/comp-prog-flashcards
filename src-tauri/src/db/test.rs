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

fn init_test_db() -> Result<
    SqliteConnection,
    Box<dyn Error + Send + Sync + 'static>
> {
    let mut conn = SqliteConnection::establish(TEST_DB_URL)?;
    conn.run_pending_migrations(TEST_MIGRATIONS)?;
    let conn = conn;
    Ok(conn)
}

#[test]
fn t() {
    let conn = &mut init_test_db().unwrap();
    use schema::{ User };
    insert_into(User::table)
        .values((
            User::username.eq("test"),
            User::avatar.eq(1),
            User::username.eq("test"),
            User::theme.eq(1),
            User::tagmask.eq(0),
            User::hidediffs.eq(false),
        ))
        .execute(conn)
        .unwrap();
    let should_eq_1 = User::table.select(User::id)
        .load::<i32>(conn)
        .unwrap()[0];
    assert_eq!(should_eq_1, 1);
}