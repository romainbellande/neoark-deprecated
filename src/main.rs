#![feature(
    proc_macro_hygiene,
    decl_macro,
    vec_remove_item,
    custom_attribute,
    duration_float
)]

#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate rocket;

mod db;
mod routes;
mod server;

use neoark_lib::*;

use server::Server;

pub fn main() {
    let mut server = Server::new();

    server.run();
}
