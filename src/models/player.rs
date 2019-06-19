use diesel::prelude::*;

use super::schema;
use super::schema::players;

use super::Planet;

#[derive(Serialize, Deserialize)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

#[model]
pub struct Player {
    pub email: String,
    pub username: String,
    pub password: String,
}

impl Player {
    pub fn new(email: String, username: String, password: String) -> Player {
        Player {
            id: -1,
            email,
            username,
            password,
        }
    }

    pub fn fetch_by_username(
        username_given: String,
        conn: &diesel::PgConnection,
    ) -> Option<Player> {
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

    pub fn fetch_by_email(email_given: String, conn: &diesel::PgConnection) -> Option<Player> {
        use schema::players::dsl::*;

        let res = players
            .filter(email.eq(email_given))
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

        let existing = players
            .filter(email.eq(user.email.clone()))
            .load::<Player>(conn)
            .unwrap();

        if existing.len() != 0 {
            return None;
        }

        let mut user = Player::new(
            user.email.clone(),
            user.username.clone(),
            user.password.clone(),
        );

        user.save(&conn);

        Planet::create_for(user.id, conn);
        
        Some(user)
    }

    pub fn login(user: Credentials, conn: &diesel::PgConnection) -> Option<Player> {
        let res = Player::fetch_by_email(user.email.clone(), conn);

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
