use super::auth::ApiKey;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

use super::db;
use super::models::Player;
use super::models::Processor;

#[get("/")]
fn get(key: ApiKey, connection: db::Connection) -> Result<Json<Vec<Processor>>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let processors = Processor::list(&connection);

    Ok(Json(processors))
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
fn get_one(
    key: ApiKey,
    id: i32,
    connection: db::Connection,
) -> Result<Json<Processor>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let processor = Processor::fetch(id, &connection);

    if processor.is_none() {
        return Err(NotFound("Processor not found".to_string()));
    }

    let processor = processor.unwrap();

    if processor.player_id != player.id {
        return Err(NotFound("Bad processor id".to_string()));
    }

    Ok(Json(processor))
}

#[get("/<_id>", rank = 2)]
fn get_one_error(_id: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

#[put("/<id>/upgrade")]
fn upgrade(
    key: ApiKey,
    id: i32,
    connection: db::Connection,
) -> Result<Json<Processor>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let player = player.unwrap();

    let processor = Processor::fetch(id, &connection);

    if processor.is_none() {
        return Err(NotFound("Processor not found".to_string()));
    }

    let mut processor = processor.unwrap();

    if processor.player_id != player.id {
        return Err(NotFound("Bad processor id".to_string()));
    }

    match processor.schedule_upgrade(&connection) {
        Ok(processor) => Ok(Json(processor)),
        Err(err) => Err(NotFound(err)),
    }
}

#[put("/<_id>/upgrade", rank = 2)]
fn upgrade_error(_id: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

#[post("/<planet_id>")]
fn new(
    key: ApiKey,
    planet_id: i32,
    connection: db::Connection,
) -> Result<Json<Processor>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    match Processor::buy_new(&planet_id, &connection) {
        Ok(processor) => Ok(Json(processor)),
        Err(err) => Err(NotFound(err)),
    }
}

#[post("/<_planet_id>", rank = 2)]
fn new_error(_planet_id: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

pub fn mount() -> Vec<Route> {
    routes![
        get,
        get_error,
        get_one,
        get_one_error,
        upgrade,
        upgrade_error,
        new,
        new_error
    ]
}
