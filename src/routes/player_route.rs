use super::auth::ApiKey;
use crypto::sha2::Sha256;
use jwt::{Header, Registered, Token};
use rocket::http::Status;
use rocket::response::status::NotFound;
use rocket::{routes, Route};
use rocket_contrib::json::{Json, JsonValue};

use super::db;
use super::models::{NewPlayer, Player};

#[post("/players/register", data = "<player>")]
fn register(
    player: Json<NewPlayer>,
    connection: db::Connection,
) -> Result<Json<Player>, NotFound<String>> {
    let res = Player::subscribe(player.into_inner(), &connection);

    match res {
        Some(player) => Ok(Json(player)),
        None => Err(NotFound("Player already exists".to_string())),
    }
}

#[post("/players/login", data = "<player>")]
fn login(player: Json<NewPlayer>, connection: db::Connection) -> Result<Json<JsonValue>, Status> {
    let header: Header = Default::default();

    match Player::login(player.into_inner(), &connection) {
        None => Err(Status::NotFound),
        Some(player) => {
            let claims = Registered {
                sub: Some(player.username.into()),
                ..Default::default()
            };
            let token = Token::new(header, claims);

            token
                .signed(b"secret_key", Sha256::new())
                .map(|message| Json(json!({ "success": true, "token": message })))
                .map_err(|_| Status::InternalServerError)
        }
    }
}

#[get("/players/me")]
fn me(key: ApiKey, connection: db::Connection) -> Result<Json<JsonValue>, NotFound<String>> {
    let player = Player::fetch_by_username(key.0, &connection);

    match player {
        Some(player) => Ok(Json(json!(
            {
                "id": player.id,
                "username": player.username,
            }
        ))),
        None => Err(NotFound("Player not found".to_string())),
    }
}

#[get("/players/me", rank = 2)]
fn me_error() -> Json<JsonValue> {
    Json(json!(
        {
            "success": false,
            "message": "Not authorized"
        }
    ))
}

pub fn mount() -> Vec<Route> {
    routes![register, login, me, me_error]
}
