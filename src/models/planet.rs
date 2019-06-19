use bigdecimal::{BigDecimal, ToPrimitive, Zero};
use diesel::prelude::*;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::time::SystemTime;

use super::super::defines::RECIPES;
use super::schema;
use super::schema::planets;
use super::{Inventory, Processor, Technology};

#[derive(Default, Debug, Clone)]
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
        let mut pc = ProductionContext {
            id,
            ..Default::default()
        };

        pc.produced = pc.produced.with_prec(6);
        pc.consumed = pc.consumed.with_prec(6);
        pc.ratio = pc.ratio.with_prec(6);
        pc.rate = pc.rate.with_prec(6);

        pc
    }
}

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct ProductionContextRes {
    pub id: i32,
    pub actual_rate: BigDecimal,
    pub producing_rate: BigDecimal,
}

impl ProductionContextRes {
    pub fn from_details(pc: ProductionContext) -> ProductionContextRes {
        ProductionContextRes {
            id: pc.id,
            actual_rate: pc.rate.clone().with_prec(6),
            producing_rate: pc.rate.clone().with_prec(6),
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

    pub fn list_by_player(player_id_given: i32, conn: &diesel::PgConnection) -> Vec<Planet> {
        use schema::planets::dsl::*;

        planets
            .filter(player_id.eq(player_id_given))
            .load::<Planet>(conn)
            .unwrap()
    }

    pub fn create_for(user_id: i32, conn: &diesel::PgConnection) {
        let mut planet = Planet::new(user_id, "NewPlanet".to_string());

        planet.save(conn);

        Inventory::new(user_id, planet.id).save(conn);
    }

    fn get_production_context(
        processors: Vec<Rc<RefCell<Processor>>>,
        elapsed: BigDecimal,
        elec_ratio: BigDecimal,
        use_processor_ratio: bool,
    ) -> HashMap<i32, ProductionContext> {
        let mut global_production_context: HashMap<i32, ProductionContext> = HashMap::new();

        for _processor in processors {
            let mut processor = _processor.borrow_mut();

            if processor.recipe < 0
                || processor.upgrade_finish.is_some()
                || processor.user_ratio == 0
            {
                continue;
            }
            let ratio = if use_processor_ratio {
                processor.ratio.clone()
            } else {
                BigDecimal::from(1.0).with_prec(6)
            };

            let recipe = &RECIPES.get(&processor.recipe).unwrap();

            let i = &recipe.i;
            let o = &recipe.o;

            for to_consume in i {
                let entry = global_production_context
                    .entry(to_consume.id)
                    .or_insert(ProductionContext::new(to_consume.id));

                entry.consumed += elapsed.clone()
                    * (BigDecimal::from(recipe.speed)
                        * BigDecimal::from(processor.level)
                        * BigDecimal::from((1.1 as f64).powf(processor.level.into())))
                    * to_consume.amount.clone()
                    * ratio.clone()
                    * elec_ratio.clone()
                    * BigDecimal::from(processor.user_ratio as f64 / 100.0);

                entry.attached_processors.push(_processor.clone())
            }

            for to_produce in o {
                let entry = global_production_context
                    .entry(to_produce.id)
                    .or_insert(ProductionContext::new(to_produce.id));

                entry.produced += elapsed.clone()
                    * (BigDecimal::from(recipe.speed)
                        * BigDecimal::from(processor.level)
                        * BigDecimal::from((1.1 as f64).powf(processor.level.into())))
                    * to_produce.amount.clone()
                    * ratio.clone()
                    * elec_ratio.clone()
                    * BigDecimal::from(processor.user_ratio as f64 / 100.0);
            }

            // if not generator
            if processor.recipe != 3 && use_processor_ratio == true {
                processor.ratio = (ratio.clone()
                    * elec_ratio.clone()
                    * BigDecimal::from(processor.user_ratio as f64 / 100.0))
                .with_prec(6);
            }
        }

        global_production_context
    }

    pub fn calc_electric_ratio(
        processors: &Vec<Processor>,
        inventory_items: &HashMap<i32, BigDecimal>,
    ) -> ((BigDecimal, BigDecimal), BigDecimal) {
        let mut total_conso = BigDecimal::from(0).with_prec(6);
        let mut total_prod = BigDecimal::from(0).with_prec(6);

        for processor in processors {
            if processor.recipe < 0 {
                continue;
            }
            let recipe = &RECIPES.get(&processor.recipe).unwrap();

            total_conso += BigDecimal::from(recipe.conso)
                * BigDecimal::from(processor.level)
                * BigDecimal::from((1.1 as f64).powf(processor.level.into()))
                * BigDecimal::from(processor.user_ratio as f64 / 100.0);

            // if it is a generator
            if processor.recipe == 3 {
                total_prod += BigDecimal::from(recipe.speed)
                    * BigDecimal::from(processor.level)
                    * (BigDecimal::from((1.1 as f64).powf(processor.level.into()))
                        * BigDecimal::from(processor.user_ratio as f64 / 100.0));
            }
        }

        let mut ratio = BigDecimal::from(1.0).with_prec(6);

        let new_ratio = total_prod.clone() / total_conso.clone();

        if new_ratio.clone() < ratio.clone() {
            ratio = new_ratio;
        }

        (
            (total_prod.with_prec(6), total_conso.with_prec(6)),
            ratio.with_prec(6),
        )
    }

    pub fn refresh_for(
        planet_id: i32,
        conn: &diesel::PgConnection,
    ) -> (
        HashMap<i32, BigDecimal>,
        Vec<Processor>,
        HashMap<i32, ProductionContextRes>,
        ((BigDecimal, BigDecimal), BigDecimal),
    ) {
        Planet::fetch(planet_id, conn).unwrap().refresh(conn)
    }

    pub fn refresh(
        &self,
        conn: &diesel::PgConnection,
    ) -> (
        HashMap<i32, BigDecimal>,
        Vec<Processor>,
        HashMap<i32, ProductionContextRes>,
        ((BigDecimal, BigDecimal), BigDecimal),
    ) {
        let mut _processors = Processor::list_by_planet(&self.id, conn);

        let mut processors = vec![];

        let mut time = SystemTime::now();
        let mut is_building = None;

        for processor in _processors.clone() {
            let shared = Rc::new(RefCell::new(processor.clone()));
            if let Some(finish_time) = &processor.upgrade_finish {
                // if finish is in the past
                if let Err(_) = finish_time.duration_since(SystemTime::now()) {
                    time = *finish_time;
                    is_building = Some(shared.clone());
                }
            } else {
                shared.borrow_mut().ratio = BigDecimal::from(processor.user_ratio as f64 / 100.0);
            }
            processors.push(shared);
        }

        let mut inventory = Inventory::fetch_by_planet(&self.id, conn).unwrap();

        let mut total: HashMap<i32, BigDecimal> = serde_json::from_str(&inventory.items).unwrap();

        let elapsed = time.duration_since(inventory.last_update).unwrap();

        inventory.last_update = time;

        let elapsed = BigDecimal::from(elapsed.as_secs_f64() / 60.0 / 60.0);

        let elec_summary = Self::calc_electric_ratio(&_processors, &total);
        let (_, elec_ratio) = elec_summary.clone();

        let mut global_production_context = Self::get_production_context(
            processors.clone(),
            elapsed.clone(),
            elec_ratio.clone(),
            false,
        );

        let mut prod_res = HashMap::new();

        for (_, value) in global_production_context.iter_mut() {
            value.ratio = BigDecimal::from(1.0).with_prec(6);

            let inventory_total = total
                .entry(value.id)
                .or_insert(BigDecimal::zero().with_prec(6));

            if value.consumed > (value.produced.clone() + inventory_total.clone()) {
                value.ratio =
                    (value.produced.clone() + inventory_total.clone()) / value.consumed.clone();
            }

            value.ratio = value.ratio.with_prec(6);

            value.rate = (value.produced.clone() - value.consumed.clone()) / elapsed.clone();

            value.rate = value.rate.with_prec(6);

            for processor in &value.attached_processors {
                let mut guard = processor.borrow_mut();
                if let Some(_) = guard.upgrade_finish {
                    guard.ratio = BigDecimal::zero().with_prec(6);
                    guard.save(conn);
                } else if guard.ratio.clone() > value.ratio.clone() {
                    guard.ratio = value.ratio.with_prec(6).clone();
                    guard.save(conn);
                }
            }
            prod_res.insert(
                value.id.clone(),
                ProductionContextRes::from_details(value.clone()),
            );
        }

        let mut global_production_context2 = Self::get_production_context(
            processors.clone(),
            elapsed.clone(),
            elec_ratio.clone(),
            true,
        );

        for (key, value) in global_production_context2.iter_mut() {
            value.rate = (value.produced.clone() - value.consumed.clone()) / elapsed.clone();

            value.rate = value.rate.with_prec(6);

            prod_res.get_mut(&key).unwrap().actual_rate = value.rate.clone();

            *total
                .entry(*key)
                .or_insert(BigDecimal::default().with_prec(6)) +=
                value.produced.with_prec(6).clone() - value.consumed.with_prec(6).clone()
        }

        let science_packs = global_production_context2
            .entry(3)
            .or_default();

        Technology::refresh(
            &self.player_id,
            science_packs.consumed.clone(),
            &mut total,
            conn,
        );

        let mut _processors = vec![];
        for processor in processors {
            _processors.push(processor.borrow().clone());
        }

        inventory.items = serde_json::to_string(&total).unwrap();

        inventory.save(conn);

        let mut inventory_total = HashMap::new();

        for (k, v) in total.iter() {
            inventory_total.insert(k.clone(), v.with_prec(6));
        }

        // must recurse
        if let Some(building) = is_building {
            let mut building = building.borrow_mut();

            building.level += 1;
            building.upgrade_finish = None;

            if !building.save(conn) {
                return (inventory_total, _processors, prod_res, elec_summary);
            }

            return self.refresh(conn);
        }

        (inventory_total, _processors, prod_res, elec_summary)
    }
}
