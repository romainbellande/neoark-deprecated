use diesel::prelude::*;

use super::schema;
use super::schema::players;

#[model]
pub struct Player {
    pub name: String,
}

impl Player {
    pub fn new(name: String) -> Player {
        Player {
            id: -1,
            name
        }
    }
}
