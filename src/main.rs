#![feature(proc_macro_hygiene, decl_macro, vec_remove_item, custom_attribute)]

#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate orm_macro_derive;

mod db;
mod models;
mod routes;
mod schema;
mod server;

use server::Server;

fn main() {
    let mut server = Server::new();

    server.run();
}
