use rocket_contrib::serve::StaticFiles;

use super::db;
use super::routes::*;

pub struct Server {}

impl Server {
    pub fn new() -> Self {
        Self {}
    }

    pub fn run(&mut self) {
        Self::listen_http(); // Blocking call;
    }

    fn listen_http() {
        let assets = std::env::current_dir().unwrap().join("client/build");

        rocket::ignite()
            .manage(db::connect())
            .mount("/", StaticFiles::from(assets))
            .mount("/api/v1/players", player_route::mount())
            .mount("/api/v1/planets", planet_route::mount())
            .mount("/api/v1/processors", processor_route::mount())
            .launch();
    }
}
