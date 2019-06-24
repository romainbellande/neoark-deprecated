use bigdecimal::BigDecimal;
use std::collections::HashMap;
use std::fs::File;
use std::io::prelude::*;

const RECIPES_PATH: &str = "./client/src/common/mocks/recipes.json";
const BUILDINGS_PATH: &str = "./client/src/common/mocks/building-configurations.json";
const TECHNOLOGIES_PATH: &str = "./client/src/common/mocks/technologies.json";
const SHIPS_PATH: &str = "./client/src/common/mocks/technologies.json";
const ITEMS_PATH: &str = "./client/src/common/mocks/items.json";

#[derive(Serialize, Deserialize)]
pub struct Stack {
    pub id: i32,
    pub amount: BigDecimal,
}

#[derive(Serialize, Deserialize)]
pub struct Recipe {
    pub id: i32,
    pub name: String,
    pub speed: i32,
    pub conso: i32,
    pub deps: Vec<i32>,
    pub i: Vec<Stack>,
    pub o: Vec<Stack>,
}

lazy_static! {
    pub static ref RECIPES: HashMap<i32, Recipe> = {
        let mut m = HashMap::new();

        let mut file = File::open(RECIPES_PATH).expect("could not open file");

        let mut contents = String::new();

        file.read_to_string(&mut contents).unwrap();

        let recipes: Vec<Recipe> =
            serde_json::from_str(&contents).expect("Cannot deserialize recipes.json");

        for recipe in recipes {
            m.insert(recipe.id, recipe);
        }

        m
    };
}

#[derive(Serialize, Deserialize)]
pub struct Item {
    pub id: i32,
    pub name: String,
    pub recipe_id: i32,
}

lazy_static! {
    pub static ref ITEMS: HashMap<i32, Item> = {
        let mut m = HashMap::new();

        let mut file = File::open(ITEMS_PATH).expect("could not open file");

        let mut contents = String::new();

        file.read_to_string(&mut contents).unwrap();

        let items: Vec<Item> =
            serde_json::from_str(&contents).expect("Cannot deserialize items.json");

        for item in items {
            m.insert(item.id, item);
        }

        m
    };
}

#[derive(Serialize, Deserialize)]
pub struct Building {
    pub id: i32,
    pub name: String,
    pub level_multiplier: f64,
    pub costs: Vec<Stack>,
}

lazy_static! {
    pub static ref BUILDINGS: HashMap<i32, Building> = {
        let mut m = HashMap::new();

        let mut file = File::open(BUILDINGS_PATH).expect("could not open file");

        let mut contents = String::new();

        file.read_to_string(&mut contents).unwrap();

        let buildings: Vec<Building> =
            serde_json::from_str(&contents).expect("Cannot deserialize buildings.json");

        for building in buildings {
            m.insert(building.id, building);
        }

        m
    };
}

#[derive(Serialize, Deserialize)]
pub struct Technology {
    pub id: i32,
    pub name: String,
    pub cost: Vec<Stack>,
    pub deps: Vec<i32>,
}

lazy_static! {
    pub static ref TECHNOLOGIES: HashMap<i32, Technology> = {
        let mut m = HashMap::new();

        let mut file = File::open(TECHNOLOGIES_PATH).expect("could not open file");

        let mut contents = String::new();

        file.read_to_string(&mut contents).unwrap();

        let technologies: Vec<Technology> =
            serde_json::from_str(&contents).expect("Cannot deserialize technologies.json");

        for technology in technologies {
            m.insert(technology.id, technology);
        }

        m
    };
}

#[derive(Serialize, Deserialize)]
pub struct Ship {
    pub id: i32,
    pub name: String,
    pub speed: i32,
}

lazy_static! {
    pub static ref SHIPS: HashMap<i32, Ship> = {
        let mut m = HashMap::new();

        let mut file = File::open(SHIPS_PATH).expect("could not open file");

        let mut contents = String::new();

        file.read_to_string(&mut contents).unwrap();

        let ships: Vec<Ship> =
            serde_json::from_str(&contents).expect("Cannot deserialize ships.json");

        for ship in ships {
            m.insert(ship.id, ship);
        }

        m
    };
}
