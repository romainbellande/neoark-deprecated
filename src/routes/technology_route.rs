use bigdecimal::{BigDecimal, Zero};
use super::auth::ApiKey;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

use super::super::defines::TECHNOLOGIES;
use super::db;
use super::models::Planet;
use super::models::Player;
use super::models::Technology;

#[get("/<planet_id>")]
fn get(
    key: ApiKey,
    planet_id: i32,
    connection: db::Connection,
) -> Result<Json<Technology>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let planet = Planet::fetch(planet_id, &connection);

    if planet.is_none() {
        return Err(NotFound("Planet not found".to_string()));
    }

    let mut planet = planet.unwrap();

    if planet.player_id != player.id {
        return Err(NotFound("Bad planet id".to_string()));
    }

    planet.refresh(&connection);

    let techno = Technology::fetch_by_planet(&planet_id, &connection).unwrap();

    Ok(Json(techno))
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

#[put("/<planet_id>/set_research/<techno_id>")]
fn set_techno(
    key: ApiKey,
    planet_id: i32,
    techno_id: i32,
    connection: db::Connection,
) -> Result<Json<Technology>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let _ = Planet::refresh_for(planet_id, &connection);

    let mut technologies = Technology::fetch_by_planet(&planet_id, &connection).unwrap();

    if techno_id == -1 {
        technologies.current_research = -1;
        technologies.current_progress = BigDecimal::zero();
        technologies.save(&connection);
    } else {
        match technologies.set_current_research(&techno_id, &connection) {
            Ok(_) => (),
            Err(err) => return Err(NotFound(err)),
        };
    }

    Ok(Json(technologies))
}

#[put("/<planet_id>/set_research/<_techno_id>", rank = 2)]
fn set_techno_error(planet_id: i32, _techno_id: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

pub fn mount() -> Vec<Route> {
    routes![get, get_error, set_techno, set_techno_error]
}
