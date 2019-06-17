use std::borrow::Cow;
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::path::PathBuf; // Cow = clone on write

const recipes_path: &str = "./client/src/mocks/recipes.json";

lazy_static! {
    pub static ref RECIPES: HashMap<i32, Recipe> = {
        let mut m = HashMap::new();

        let mut file = File::open(recipes_path).expect("could not open file");

        let mut contents = String::new();

        file.read_to_string(&mut contents);

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
    pub amount: i32,
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
