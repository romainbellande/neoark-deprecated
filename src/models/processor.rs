use bigdecimal::{BigDecimal, ToPrimitive};
use diesel::prelude::*;
use std::ops::Add;
use std::time::{Duration, SystemTime};

use super::inventory::*;
use super::schema;
use super::schema::processors;

#[model]
pub struct Processor {
    pub player_id: i32,
    pub planet_id: i32,
    pub level: i32,
    pub upgrade_finish: Option<SystemTime>,
    pub upgrade_finished: Option<SystemTime>,
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
            upgrade_finished: None,
            ratio: BigDecimal::from(1.0),
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

    pub fn list_upgrading_by_planet(
        planet_id_given: &i32,
        conn: &diesel::PgConnection,
    ) -> Vec<Processor> {
        use schema::processors::dsl::*;

        processors
            .filter(upgrade_finish.is_distinct_from(None as Option<SystemTime>))
            .filter(planet_id.eq(planet_id_given))
            .order(id.desc())
            .load::<Processor>(conn)
            .unwrap()
    }

    pub fn schedule_upgrade(&mut self, conn: &diesel::PgConnection) -> Result<Processor, String> {
        if Self::list_upgrading_by_planet(&self.planet_id, conn).len() != 0 {
            return Err("A building is already upgrading".to_string());
        }

        let mut inventory = Inventory::fetch_by_planet(&self.planet_id, conn).unwrap();

        let has_bought = inventory.buy(&Inventory::cost_of(&0, self.level + 1), conn);

        if !has_bought {
            return Err("Not enough".to_string());
        }

        self.upgrade_finish = Some(SystemTime::now().add(Duration::from_secs(10)));

        self.save(conn);

        Ok(self.clone())
    }

    pub fn buy_new(planet_id: &i32, conn: &diesel::PgConnection) -> Result<Processor, String> {
        if Self::list_upgrading_by_planet(&planet_id, conn).len() != 0 {
            return Err("A building is already upgrading".to_string());
        }

        let mut inventory = Inventory::fetch_by_planet(planet_id, conn).unwrap();

        let cost = Inventory::cost_of(&0, 1);

        let has_bought = inventory.buy(&cost, conn);

        if !has_bought {
            return Err("Not enough".to_string());
        }

        let mut processor = Processor::new(inventory.player_id, *planet_id);

        let build_time = {
            let metal = cost.get(&0).unwrap().to_u64().unwrap();
            let crystal = cost.get(&0).unwrap().to_u64().unwrap();

            Duration::from_secs((metal + crystal) / (2500) * 60 * 60)
        };

        processor.upgrade_finish = Some(SystemTime::now().add(build_time));

        processor.save(conn);

        Ok(processor)
    }
}
