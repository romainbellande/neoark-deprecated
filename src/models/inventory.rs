use bigdecimal::BigDecimal;
use diesel::prelude::*;
use std::collections::HashMap;
use std::convert::TryInto;
use std::time::SystemTime;

use super::super::defines::BUILDINGS;
use super::schema;
use super::schema::inventories;

#[model("inventories")]
pub struct Inventory {
    pub player_id: i32,
    pub planet_id: i32,
    pub items: String,
    pub last_update: SystemTime,
}

impl Inventory {
    pub fn new(player_id: i32, planet_id: i32) -> Inventory {
        Inventory {
            id: -1,
            player_id,
            planet_id,
            items: "{}".to_string(),
            last_update: SystemTime::now(),
        }
    }

    pub fn fetch_by_planet(
        planet_id_given: &i32,
        conn: &diesel::PgConnection,
    ) -> Option<Inventory> {
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

    pub fn cost_of(building_type: &i32, level: i32) -> HashMap<i32, BigDecimal> {
        let build_type = &BUILDINGS[building_type];

        let mut costs = HashMap::new();

        for cost in &build_type.costs {
            costs.insert(
                cost.id,
                cost.amount.clone()
                    * BigDecimal::from(
                        build_type
                            .level_multiplier
                            .powf((level - 1).try_into().unwrap()),
                    ),
            );
        }

        costs
    }

    pub fn has_enough(&mut self, costs: &HashMap<i32, BigDecimal>) -> bool {
        let items: HashMap<i32, BigDecimal> = serde_json::from_str(&self.items).unwrap();

        for (k, v) in costs.iter() {
            let own = match items.get(k) {
                Some(own) => own,
                None => return false,
            };

            if own < v {
                return false;
            }
        }

        true
    }

    pub fn buy(&mut self, costs: &HashMap<i32, BigDecimal>, conn: &diesel::PgConnection) -> bool {
        let mut items: HashMap<i32, BigDecimal> = serde_json::from_str(&self.items).unwrap();

        if !self.has_enough(&costs) {
            return false;
        }

        for (k, v) in costs.iter() {
            *items.entry(*k).or_insert(BigDecimal::from(0).with_prec(6)) -= v;
        }

        self.items = serde_json::to_string(&items).unwrap();

        self.save(conn);

        true
    }
}
