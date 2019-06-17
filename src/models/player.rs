use diesel::prelude::*;

use super::schema;
use super::schema::players;

#[model]
pub struct Player {
    pub username: String,
    pub password: String,
}

impl Player {
    pub fn new(username: String, password: String) -> Player {
        Player {
            id: -1,
            username,
            password,
        }
    }

    pub fn fetch_by_username(username_given: String, conn: &diesel::PgConnection) -> Option<Player> {
        use schema::players::dsl::*;

        let res = players
            .filter(username.eq(username_given))
            .load::<Player>(conn)
            .unwrap();

        if res.len() != 1 {
            return None;
        }

        Some(res[0].clone())
    }

    pub fn subscribe(user: NewPlayer, conn: &diesel::PgConnection) -> Option<Player> {
        use schema::players::dsl::*;
        let existing = players
            .filter(username.eq(user.username.clone()))
            .load::<Player>(conn)
            .unwrap();

        if existing.len() != 0 {
            return None;
        }

        let user = Player::create(
            Player::new(user.username.clone(), user.password.clone()),
            &conn,
        );

        Some(user)
    }

    pub fn login(user: NewPlayer, conn: &diesel::PgConnection) -> Option<Player> {
        let res = Player::fetch_by_username(user.username.clone(), conn);

        if res.is_none() {
            println!("Unknown user");

            return None;
        }

        let res = res.unwrap();

        if user.password != res.password {
            println!("Bad password");

            return None;
        }

        Some(res)
    }
}

