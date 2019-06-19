use bigdecimal::BigDecimal;
use std::collections::HashMap;
use std::fs::File;
use std::io::prelude::*;
use serde::*;
use serde_json::*;

const RECIPES_PATH: &str = "./client/src/common/mocks/recipes.json";
const BUILDINGS_PATH: &str = "./client/src/common/mocks/building-configurations.json";
const TECHNOLOGIES_PATH: &str = "./client/src/common/mocks/technologies.json";
const SHIPS_PATH: &str = "./client/src/common/mocks/technologies.json";

fn read_file<'a, T>(path: &str) -> Vec<T> where T: Deserialize<'a> {
    let mut m = HashMap::new();

    let mut file = File::open(path).expect("could not open file");

    let mut contents = String::new();

    file.read_to_string(&mut contents).unwrap();

    let recipes: Vec<T> =
        serde_json::from_str(&contents).expect((&"Cannot deserialize ".to_string() + &path.to_string()));

    recipes
}

#[derive(Serialize, Deserialize)]
pub struct Item {
    pub id: i32,
    pub amount: BigDecimal,
}

#[derive(Serialize, Deserialize)]
pub struct Recipe {
    pub id: i32,
    pub name: String,
    pub speed: i32,
    pub conso: i32,
    pub i: Vec<Item>,
    pub o: Vec<Item>,
}

impl Recipe {
    // pub fn new() -> Recipe {
    //     Recipe {
    //     }
    // }
}

lazy_static! {
    pub static ref RECIPES: HashMap<i32, Recipe> = {
        let mut m = HashMap::new();

        let recipes: Vec<Recipe> =  read_file(RECIPES_PATH);

        for recipe in recipes {
            m.insert(recipe.id, recipe);
        }

        m
    };
}

#[derive(Serialize, Deserialize)]
pub struct Building {
    pub id: i32,
    pub name: String,
    pub level_multiplier: f64,
    pub costs: Vec<Item>,
}

lazy_static! {
    pub static ref BUILDINGS: HashMap<i32, Building> = {
        let mut m = HashMap::new();

        let buildings: Vec<Building> = read_file(BUILDINGS_PATH);

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
    pub cost: Vec<Item>,
    pub deps: Vec<i32>,
}

lazy_static! {
    pub static ref TECHNOLOGIES: HashMap<i32, Technology> = {
        let mut m = HashMap::new();

        let technologies: Vec<Technology> = read_file(TECHNOLOGIES_PATH);
        
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

        let ships: Vec<Ship> = read_file(SHIPS_PATH);
        
        for ship in ships {
            m.insert(ship.id, ship);
        }

        m
    };
}
