use bigdecimal::BigDecimal;
use std::collections::HashMap;
use std::fs::File;
use std::io::prelude::*;

const RECIPES_PATH: &str = "./client/src/mocks/recipes.json";

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
    pub amount: BigDecimal,
}

#[derive(Serialize, Deserialize)]
pub struct Recipe {
    pub id: i32,
    pub name: String,
    pub speed: i32,
    pub i: Vec<Item>,
    pub o: Vec<Item>,
}

impl Recipe {
    // pub fn new() -> Recipe {
    //     Recipe {
    //     }
    // }
}
