use diesel::prelude::*;

use super::schema;
use super::schema::planets;

#[model]
pub struct Planet {
    pub player_id: i32,
    pub name: String,
    pub iron_mine: i32,
}

impl Planet {
    pub fn new(player_id: i32, name: String) -> Planet {
        Planet {
            id: -1,
            player_id,
            name,
            iron_mine: 0
        }
    }
}
