use bigdecimal::BigDecimal;
use diesel::prelude::*;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::time::SystemTime;

use super::super::recipes::RECIPES;
use super::schema;
use super::schema::planets;
use super::{Inventory, Processor};

#[derive(Default, Debug)]
pub struct ProductionContext {
    pub id: i32,
    pub produced: BigDecimal,
    pub consumed: BigDecimal,
    pub ratio: BigDecimal,
    pub rate: BigDecimal,
    pub attached_processors: Vec<Rc<RefCell<Processor>>>,
}

impl ProductionContext {
    pub fn new(id: i32) -> ProductionContext {
        ProductionContext {
            id,
            ..Default::default()
        }
    }
}

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

    pub fn list_by_player(player_id_given: &i32, conn: &diesel::PgConnection) -> Vec<Planet> {
        use schema::planets::dsl::*;

        planets
            .filter(player_id.eq(player_id_given))
            .load::<Planet>(conn)
            .unwrap()
    }

    pub fn create_for(user_id: i32, conn: &diesel::PgConnection) {
        let mut planet = Planet::new(user_id, "NewPlanet".to_string());

        planet.save(conn);

        Inventory::new(planet.id).save(conn);
    }

    fn get_production_context(
        processors: Vec<Rc<RefCell<Processor>>>,
        elapsed: BigDecimal,
        use_processor_ratio: bool,
    ) -> HashMap<i32, ProductionContext> {
        let mut global_production_context: HashMap<i32, ProductionContext> = HashMap::new();

        for processor in processors {
            let ratio = if use_processor_ratio {
                processor.borrow().ratio.clone()
            } else {
                BigDecimal::from(1.0)
            };

            let recipe = &RECIPES[&processor.borrow().recipe];

            let i = &recipe.i;
            let o = &recipe.o;

            for to_consume in i {
                let entry = global_production_context
                    .entry(to_consume.id)
                    .or_insert(ProductionContext::new(to_consume.id));

                entry.consumed += elapsed.clone()
                    * BigDecimal::from(recipe.speed)
                    * to_consume.amount.clone()
                    * ratio.clone();

                entry.attached_processors.push(processor.clone())
            }

            for to_produce in o {
                let entry = global_production_context
                    .entry(to_produce.id)
                    .or_insert(ProductionContext::new(to_produce.id));

                entry.produced += elapsed.clone()
                    * BigDecimal::from(recipe.speed)
                    * to_produce.amount.clone()
                    * ratio.clone();
            }
        }

        global_production_context
    }

    pub fn refresh(
        &self,
        conn: &diesel::PgConnection,
    ) -> (HashMap<i32, BigDecimal>, Vec<Processor>) {
        let mut _processors = Processor::list_by_planet(&self.id, conn);

        let mut processors = vec![];

        for processor in _processors {
            processors.push(Rc::new(RefCell::new(processor)));
        }

        let mut inventory = Inventory::fetch_by_planet(&self.id, conn).unwrap();

        let mut total: HashMap<i32, BigDecimal> = serde_json::from_str(&inventory.items).unwrap();

        let elapsed = SystemTime::now()
            .duration_since(inventory.last_update)
            .unwrap();

        inventory.last_update = SystemTime::now();

        let elapsed = BigDecimal::from(elapsed.as_secs_f64() / 60.0 / 60.0);

        let mut global_production_context =
            Self::get_production_context(processors.clone(), elapsed.clone(), false);

        for (_, value) in global_production_context.iter_mut() {
            value.ratio = BigDecimal::from(1.0);

            if value.consumed > value.produced {
                value.ratio = value.produced.clone() / value.consumed.clone();
            }

            value.rate = (value.produced.clone() - value.consumed.clone()) / elapsed.clone();

            for processor in &value.attached_processors {
                let mut guard = processor.borrow_mut();

                if guard.ratio > BigDecimal::from(value.ratio.clone()) {
                    guard.ratio = BigDecimal::from(value.ratio.clone());
                    guard.save(conn);
                }
            }

            // *total.entry(*key).or_default() += value * ratio;
        }

        let global_production_context2 =
            Self::get_production_context(processors.clone(), elapsed, true);

        for (key, value) in global_production_context2.iter() {
            *total.entry(*key).or_default() += value.produced.clone() - value.consumed.clone()
        }

        let mut _processors = vec![];
        for processor in processors {
            _processors.push(processor.borrow().clone());
        }

        inventory.items = serde_json::to_string(&total).unwrap();

        inventory.save(conn);

        (total, _processors)
    }
}
