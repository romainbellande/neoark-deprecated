use diesel::prelude::*;
use std::time::SystemTime;

use super::schema;
use super::schema::processors;

#[model]
pub struct Processor {
    pub planet_id: i32,
    pub level: i32,
    pub upgrade_finish: Option<SystemTime>,
    pub recipe: i32,
}

impl Processor {
    pub fn new(planet_id: i32) -> Processor {
        Processor {
            id: -1,
            planet_id,
            level: 0,
            upgrade_finish: None,
            recipe: -1,
        }
    }

    pub fn list_by_planet(planet_id_given: &i32, conn: &diesel::PgConnection) -> Vec<Processor> {
        use schema::processors::dsl::*;

        processors
            .filter(planet_id.eq(planet_id_given))
            .load::<Processor>(conn)
            .unwrap()
    }
}
