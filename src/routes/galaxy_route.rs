use super::auth::ApiKey;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

use super::db;
use super::models::Planet;
use super::models::Player;

#[get("/<galaxy>/<system>")]
fn get(key: ApiKey, galaxy: i32, system: i32, connection: db::Connection) -> Result<Json<Vec<Planet>>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let planets = Planet::get_solar_system(galaxy, system, &connection);

    Ok(Json(planets))
}

#[get("/<_galaxy>/<_system>", rank = 2)]
fn get_error(_galaxy: i32, _system: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

pub fn mount() -> Vec<Route> {
    routes![get, get_error]
}
