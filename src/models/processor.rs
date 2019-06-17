use bigdecimal::{BigDecimal, Zero};
use diesel::prelude::*;
use std::time::SystemTime;

use super::schema;
use super::schema::processors;

#[model]
pub struct Processor {
    pub player_id: i32,
    pub planet_id: i32,
    pub level: i32,
    pub upgrade_finish: Option<SystemTime>,
    pub ratio: BigDecimal,
    pub recipe: i32,
}

impl Processor {
    pub fn new(player_id: i32, planet_id: i32) -> Processor {
        Processor {
            id: -1,
            player_id,
            planet_id,
            level: 0,
            upgrade_finish: None,
            ratio: BigDecimal::zero(),
            recipe: -1,
        }
    }

    pub fn list_by_planet(planet_id_given: &i32, conn: &diesel::PgConnection) -> Vec<Processor> {
        use schema::processors::dsl::*;

        processors
            .order(id.desc())
            .filter(planet_id.eq(planet_id_given))
            .load::<Processor>(conn)
            .unwrap()
    }
}
