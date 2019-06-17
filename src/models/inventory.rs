use diesel::prelude::*;
use std::time::SystemTime;

use super::schema;
use super::schema::inventories;

#[model("inventories")]
pub struct Inventory {
    pub planet_id: i32,
    pub items: String,
    pub last_update: SystemTime,
}

impl Inventory {
    pub fn new(planet_id: i32) -> Inventory {
        Inventory {
            id: -1,
            planet_id,
            items: "{}".to_string(),
            last_update: SystemTime::now(),
        }
    }

    pub fn fetch_by_planet(planet_id_given: &i32, conn: &diesel::PgConnection) -> Option<Inventory> {
        use schema::inventories::dsl::*;

        let res = inventories
            .filter(planet_id.eq(planet_id_given))
            .load::<Inventory>(conn)
            .unwrap();

        if res.len() != 1 {
            return None;
        }

        Some(res[0].clone())
    }

}
