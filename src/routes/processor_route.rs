use super::auth::ApiKey;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

use super::super::defines::RECIPES;
use super::db;
use super::models::Player;
use super::models::Planet;
use super::models::Processor;

#[get("/by_planet/<planet_id>")]
fn get(key: ApiKey, planet_id: i32, connection: db::Connection) -> Result<Json<Vec<Processor>>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }

    let _ = Planet::refresh_for(planet_id.clone(), &connection);

    let processors = Processor::list_by_planet(&planet_id, &connection);

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

    let _ = Planet::refresh_for(processor.planet_id, &connection);

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

    let _ = Planet::refresh_for(processor.planet_id, &connection);

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

    let _ = Planet::refresh_for(planet_id, &connection);

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

#[put("/<processor_id>/set_recipe/<recipe>")]
fn set_recipe(
    key: ApiKey,
    processor_id: i32,
    recipe: i32,
    connection: db::Connection,
) -> Result<Json<Processor>, NotFound<String>> {
    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }


    let processor = Processor::fetch(processor_id, &connection);

    if processor.is_none() {
        return Err(NotFound("Processor not found".to_string()));
    }

    let mut processor = processor.unwrap();

    let _ = Planet::refresh_for(processor.planet_id, &connection);

    if let Some(_) = processor.upgrade_finish {
        return Err(NotFound("Processor is upgrading".to_string()));
    }

    match &RECIPES.get(&recipe) {
        Some(_) => processor.recipe = recipe,
        None => return Err(NotFound("No such recipe".to_string())),
    };

    processor.save(&connection);

    Ok(Json(processor))
}

#[put("/<_processor_id>/set_recipe/<_recipe>", rank = 2)]
fn set_recipe_error(_processor_id: i32, _recipe: i32) -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

#[put("/<processor_id>/set_ratio/<ratio>")]
fn set_ratio(
    key: ApiKey,
    processor_id: i32,
    ratio: i32,
    connection: db::Connection,
) -> Result<Json<Processor>, NotFound<String>> {
    if ratio < 0 || ratio > 100 || ratio % 10 != 0 {
        return Err(NotFound("Bad ratio".to_string()));
    }

    let player = Player::fetch_by_email(key.0, &connection);

    if player.is_none() {
        return Err(NotFound("Player not found".to_string()));
    }


    let processor = Processor::fetch(processor_id, &connection);

    if processor.is_none() {
        return Err(NotFound("Processor not found".to_string()));
    }

    let mut processor = processor.unwrap();

    let _ = Planet::refresh_for(processor.planet_id, &connection);

    if let Some(_) = processor.upgrade_finish {
        return Err(NotFound("Processor is upgrading".to_string()));
    }

    processor.user_ratio = ratio;

    processor.save(&connection);

    Ok(Json(processor))
}

#[put("/<_processor_id>/set_ratio/<_ratio>", rank = 2)]
fn set_ratio_error(_processor_id: i32, _ratio: i32) -> Json<JsonValue> {
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
        new_error,
        set_recipe,
        set_recipe_error,
        set_ratio,
        set_ratio_error,
    ]
}
