#![feature(proc_macro_hygiene, decl_macro, vec_remove_item, custom_attribute)]

#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate orm_macro_derive;

mod models;
mod schema;
mod server;
mod client;
mod context;
mod proto;

use server::Server;

const DATABASE_URL: &str = "postgres://neoark:neoark@localhost/neoark";

fn main() {
    let mut server = Server::new();

    server.run();
}
