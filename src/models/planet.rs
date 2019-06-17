use diesel::prelude::*;
use std::collections::HashMap;
use std::time::SystemTime;

use super::super::recipes::RECIPES;
use super::schema;
use super::schema::planets;
use super::{Inventory, Processor};

#[model]
pub struct Planet {
    pub player_id: i32,
    pub name: String,
}

impl Planet {
    pub fn new(player_id: i32, name: String) -> Planet {
        Planet {
            id: -1,
            player_id,
            name,
        }
    }

    pub fn fetch_by_player(player_id_given: &i32, conn: &diesel::PgConnection) -> Option<Planet> {
        use schema::planets::dsl::*;

        let res = planets
            .filter(player_id.eq(player_id_given))
            .load::<Planet>(conn)
            .unwrap();

        if res.len() != 1 {
            return None;
        }

        Some(res[0].clone())
    }

    pub fn create_for(user_id: i32, conn: &diesel::PgConnection) {
        let mut planet = Planet::new(user_id, "NewPlanet".to_string());

        planet.save(conn);

        Inventory::new(planet.id).save(conn);
    }

    pub fn refresh(&self, conn: &diesel::PgConnection) {
        let processors = Processor::list_by_planet(&self.id, conn);

        let mut inventory = Inventory::fetch_by_planet(&self.id, conn).unwrap();

        let mut total: HashMap<i32, i32> = serde_json::from_str(&inventory.items).unwrap();

        let elapsed = SystemTime::now()
            .duration_since(inventory.last_update)
            .unwrap();

        inventory.last_update = SystemTime::now();

        // in hours
        let elapsed = elapsed.as_secs_f64() / 60.0 / 60.0;

        for processor in processors {
            let recipe = &RECIPES[&processor.recipe];

            let i = &recipe.i;
            let o = &recipe.o;

            for consumed in i {
                *total.entry(consumed.id).or_default() -= (elapsed * (recipe.speed as f64)) as i32;
            }

            for produced in o {
                *total.entry(produced.id).or_default() += (elapsed * (recipe.speed as f64)) as i32;
            }
        }

        inventory.items = serde_json::to_string(&total).unwrap();

        inventory.save(conn);
    }
}
