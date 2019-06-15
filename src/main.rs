#![feature(proc_macro_hygiene, decl_macro, vec_remove_item, custom_attribute)]

#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate orm_macro_derive;

mod models;
mod schema;

use diesel::pg::PgConnection;
use diesel::prelude::*;

const DATABASE_URL: &str = "postgres://neoark:neoark@localhost/neoark";

fn main() {
    let _ = PgConnection::establish(&DATABASE_URL)
        .expect(&format!("Error connecting to {}", DATABASE_URL));
}
