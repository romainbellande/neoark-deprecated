// use bigdecimal::{BigDecimal, Zero};
use super::auth::ApiKey;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

// use super::super::defines::TECHNOLOGIES;
use super::db;
use super::models::Planet;
use neoark_lib::controllers::movement_controller;
use super::models::Player;
use super::models::{Movement, MovementQuery};
use neoark_lib::controllers::planet_controller;

#[get("/by_planet/<planet_id>")]
fn get(
    key: ApiKey,
    planet_id: i32,
    connection: db::Connection,
) -> Result<Json<Vec<Movement>>, NotFound<String>> {
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

    planet_controller::pre_refresh(planet.id, &connection);

    let movements = Movement::list_by_planet(&planet_id, &connection);

    Ok(Json(movements))
}

#[get("/by_planet/<_planet_id>", rank = 2)]
fn get_error(_planet_id: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}


#[post("/", data = "<movement>")]
fn send_fleet(
    key: ApiKey,
    movement: Json<MovementQuery>,
    connection: db::Connection,
) -> Result<Json<Option<Movement>>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let movement = movement_controller::send_fleet(movement.into_inner(), &connection);

    // let planet = Planet::fetch(planet_id, &connection);

    // let mut planet = planet.unwrap();

    // if planet.player_id != player.id {
    //     return Err(NotFound("Bad planet id".to_string()));
    // }

    // planet_controller::pre_refresh(planet.id, &connection);

    // let mut technologies = Movement::fetch_by_planet(&planet_id, &connection).unwrap();

    // if techno_id == -1 {
    //     technologies.current_research = -1;
    //     technologies.current_progress = BigDecimal::zero();
    //     technologies.save(&connection);
    // } else {
    //     match technologies.set_current_research(&techno_id, &connection) {
    //         Ok(_) => (),
    //         Err(err) => return Err(NotFound(err)),
    //     };
    // }

    Ok(Json(movement))
}

#[post("/", rank = 2)]
fn send_fleet_error() -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

pub fn mount() -> Vec<Route> {
    routes![get, get_error, send_fleet, send_fleet_error]
}
