use bigdecimal::{BigDecimal, Zero};
use diesel::prelude::*;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::time::SystemTime;

use super::super::defines::TECHNOLOGIES;
use super::processor::*;
use super::schema;
use super::schema::technologies;

const dev_mode: bool = true;

#[model("technologies")]
pub struct Technology {
    pub player_id: i32,
    pub planet_id: i32,
    pub current_research: i32,
    pub current_progress: BigDecimal,
    pub searched: String,
    pub last_update: SystemTime,
}

impl Technology {
    pub fn new(player_id: i32, planet_id: i32) -> Technology {
        Technology {
            id: -1,
            player_id,
            planet_id,
            current_research: -1,
            current_progress: BigDecimal::from(0),
            searched: "{}".to_string(),
            last_update: SystemTime::now(),
        }
    }

    pub fn fetch_by_planet(
        planet_id_given: &i32,
        conn: &diesel::PgConnection,
    ) -> Option<Technology> {
        use schema::technologies::dsl::*;

        let res = technologies
            .filter(planet_id.eq(planet_id_given))
            .load::<Technology>(conn)
            .unwrap();

        if res.len() != 1 {
            return None;
        }

        Some(res[0].clone())
    }

    pub fn set_current_research(
        &mut self,
        techno_id: &i32,
        conn: &diesel::PgConnection,
    ) -> Result<(), String> {
        let mut searched: HashMap<i32, BigDecimal> = serde_json::from_str(&self.searched).unwrap();

        let techno = match &TECHNOLOGIES.get(&techno_id) {
            Some(techno) => techno.clone(),
            None => return Err("Technology not found".to_string()),
        };

        if searched.get(techno_id).is_some() {
            return Err("Technology already searched".to_string());
        }

        for dep in &techno.deps {
            if searched.get(&dep).is_none() {
                return Err("Technology dependencies not satisfied.".to_string());
            }
        }

        // HERE: save current state before.

        self.current_progress = BigDecimal::zero();
        self.current_research = *techno_id;

        self.save(conn);

        Ok(())
    }

    pub fn refresh(
        planet_id: &i32,
        science_consumed: BigDecimal,
        inventory: &mut HashMap<i32, BigDecimal>,
        conn: &diesel::PgConnection,
    ) {
        let mut technologies = Technology::fetch_by_planet(&planet_id, conn).unwrap();

        if technologies.current_research == -1 {
            technologies.last_update = SystemTime::now();
            technologies.save(conn);

            return;
        }

        let current = TECHNOLOGIES.get(&technologies.current_research).unwrap();

        let cost = &current.cost;

        let remaining = cost[0].amount.clone()
            - (technologies.current_progress.clone() + science_consumed.clone());

        technologies.current_progress += science_consumed.clone();
        if remaining <= BigDecimal::zero() {
            let mut searched: HashMap<i32, BigDecimal> = serde_json::from_str(&technologies.searched).unwrap();

            *inventory
                .entry(3)
                .or_insert(BigDecimal::zero().with_prec(6)) += -remaining;

            *searched.entry(technologies.current_research).or_default() = BigDecimal::zero();

            technologies.current_research = -1;
            technologies.current_progress = BigDecimal::zero();

            technologies.searched = serde_json::to_string(&searched).unwrap();
        }

        technologies.last_update = SystemTime::now();
        technologies.save(conn);
    }
}
