use bigdecimal::{BigDecimal, Zero};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use rocket_contrib::serve::StaticFiles;
use std::sync::{Arc, RwLock};
use ws::listen;

use super::client::Client;
use super::context::Context;
use super::models::*;
// use super::Packet;
use super::DATABASE_URL;

pub struct Server {
    context: Arc<RwLock<Context>>,
}

impl Server {
    pub fn new() -> Server {
        Server {
            context: Context::new_shared(),
        }
    }

    pub fn run(&mut self) {
        Server::listen_ws(self.context.clone());

        Server::listen_http(); // Blocking call;
    }

    fn listen_ws(context: Arc<RwLock<Context>>) {
        std::thread::spawn(move || {
            listen("0.0.0.0:8001", |out| {
                let context = context.clone();

                // context.write().unwrap().clients.push(out.clone());

                let mut client = Client::new(out, context.clone());

                // client.periodic_events();

                client
            })
            .unwrap();
        });
    }

    fn listen_http() {
        let assets = std::env::current_dir().unwrap().join("client/build");

        rocket::ignite()
            .mount("/", StaticFiles::from(assets))
            .launch();
    }
}
