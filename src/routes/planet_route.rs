use super::auth::ApiKey;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

use super::db;
use super::models::Planet;
use super::models::Player;

#[get("/")]
fn get(key: ApiKey, connection: db::Connection) -> Result<Json<Vec<Planet>>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let planets = Planet::list(&connection);

    Ok(Json(planets))
}

#[get("/", rank = 2)]
fn get_error() -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

#[get("/<id>")]
fn get_one(key: ApiKey, id: i32, connection: db::Connection) -> Result<Json<Planet>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let planet = Planet::fetch(id, &connection);

    if planet.is_none() {
        return Err(NotFound("Planet not found".to_string()));
    }

    let planet = planet.unwrap();

    if planet.player_id != player.id {
        return Err(NotFound("Bad planet id".to_string()));
    }

    Ok(Json(planet))
}

#[get("/<id>", rank = 2)]
fn get_one_error(id: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

pub fn mount() -> Vec<Route> {
    routes![get, get_error, get_one, get_one_error]
}
