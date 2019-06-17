use bigdecimal::BigDecimal;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde_json::json;
use std::sync::{Arc, RwLock};
use ws::{CloseCode, Handler, Handshake, Message, Result, Sender};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};

use redis::*;
use super::models::*;
use super::proto::*;
// use super::redis::*;
use super::context::Context;
use super::DATABASE_URL;

pub struct Client {
    user_id: i32,
    hash: String,
    is_logged: bool,
    db: PgConnection,
    out: Sender,
    context: Arc<RwLock<Context>>,
}

impl Client {
    pub fn new(socket: Sender, context: Arc<RwLock<Context>>) -> Client {
        let db = PgConnection::establish(&DATABASE_URL)
            .expect(&format!("Error connecting to {}", DATABASE_URL));

        Client {
            user_id: -1,
            is_logged: false,
            db,
            out: socket,
            context,
            hash: String::new(),
        }
    }

    fn register(&mut self, username: String, password: String, _email: String) {
        if self.is_logged {
            self.out.send(Packet::error("Already logged")).unwrap();

            return;
        }

        let user = Player::subscribe(NewPlayer { username, password }, &self.db);

        if user.is_none() {
            self.out
                .send(Packet::error("Bad login or password"))
                .unwrap();

            return;
        }

        let user = user.unwrap();

        let rand_string: String = thread_rng().sample_iter(&Alphanumeric).take(30).collect();

        let _: () = self
            .context
            .write()
            .unwrap()
            .redis
            .set(rand_string.clone(), user.id)
            .unwrap();

        let packet = Packet::SessionLogin {
            hash: rand_string.clone(),
        };

        self.is_logged = true;
        self.user_id = user.id;
        self.hash = rand_string;

        self.context
            .write()
            .unwrap()
            .clients
            .insert(user.id, self.out.clone());

        self.out
            .send(Message::Text(json!(packet).to_string()))
            .unwrap();

        // let packet = Packet::Account { user, wallets };

        // self.out
        //     .send(Message::Text(json!(packet).to_string()))
        //     .unwrap();
    }

    fn login(&mut self, username: String, password: String) {
        if self.is_logged {
            self.out.send(Packet::error("Already logged")).unwrap();

            return;
        }

        let user = Player::login(
            NewPlayer {
                username,
                password: password.clone(),
            },
            &self.db,
        );

        if user.is_none() {
            self.out
                .send(Packet::error("Bad login or password"))
                .unwrap();

            return;
        }

        let user = user.unwrap();

        if password != user.password {
            self.out
                .send(Packet::error("Bad login or password"))
                .unwrap();

            return;
        }

        let rand_string: String = thread_rng().sample_iter(&Alphanumeric).take(30).collect();

        let _: () = self
            .context
            .write()
            .unwrap()
            .redis
            .set(rand_string.clone(), user.id)
            .unwrap();

        let packet = Packet::SessionLogin {
            hash: rand_string.clone(),
        };

        self.is_logged = true;
        self.user_id = user.id;
        self.hash = rand_string;

        self.context
            .write()
            .unwrap()
            .clients
            .insert(user.id, self.out.clone());

        // let wallets = Wallet::list_by_user(self.user_id, &self.db).unwrap();

        self.out
            .send(Message::Text(json!(packet).to_string()))
            .unwrap();

        // let packet = Packet::Account { user, wallets };

        // self.out
        //     .send(Message::Text(json!(packet).to_string()))
        //     .unwrap();
    }

    fn session_login(&mut self, hash: String) {
        if self.is_logged {
            self.out.send(Packet::error("Already logged")).unwrap();

            return;
        }

        let id: i32 = match self.context.write().unwrap().redis.get(hash.clone()) {
            Ok(id) => id,
            Err(_) => {
                return;
            }
        };

        let user = Player::fetch(id, &self.db);

        if user.is_none() {
            return;
        }

        let user = user.unwrap();

        self.user_id = id;
        self.is_logged = true;
        self.hash = hash;

        self.context
            .write()
            .unwrap()
            .clients
            .insert(user.id, self.out.clone());

        // let wallets = Wallet::list_by_user(self.user_id, &self.db).unwrap();

        // let packet = Packet::Account { user, wallets };

        // self.out
        //     .send(Message::Text(json!(packet).to_string()))
        //     .unwrap();
    }
}


impl Handler for Client {
    fn on_open(&mut self, _hs: Handshake) -> Result<()> {
        // let packet = Packet::Initial {
        // };

        // self.out.send(packet.to_message()).unwrap();
        Ok(())
    }

    fn on_message(&mut self, msg: Message) -> Result<()> {
        if let Message::Text(txt) = msg.clone() {
            let packet = serde_json::from_str(&txt);

            if packet.is_err() {
                println!("Error decoding message {:?}", msg);

                return Ok(());
            }

            let packet: Packet = packet.unwrap();

            println!("PACKET {:?}", packet);

            match packet {
                Packet::Register {
                    username,
                    password,
                    email,
                } => self.register(username, password, email),
                Packet::Login { username, password } => self.login(username, password),
                Packet::SessionLogin { hash } => self.session_login(hash),
                Packet::Logout => self
                    .context
                    .write()
                    .unwrap()
                    .redis
                    .del(self.hash.clone())
                    .unwrap(),
                _ => (),
            }
        }

        Ok(())
    }

    fn on_close(&mut self, code: CloseCode, reason: &str) {
        match code {
            CloseCode::Normal => println!("The client is done with the connection."),
            CloseCode::Away => println!("The client is leaving the site."),
            _ => println!("The client encountered an error: {}", reason),
        }

        let mut context = self.context.write().unwrap();

        let res = context.clients.remove(&self.user_id);

        if res.is_none() {
            println!("Tried to delete a non-existant socket");
        }

        if self.is_logged {
            let res = context.clients.remove(&self.user_id);

            if res.is_none() {
                println!("Tried to delete a non-existant logged socket");
            }
        }

        // if let Some(id) = context.registered_events {
        //     if let Some(clients) = context.clients_exchanges.get_mut(&id) {
        //         clients.remove_item(&self.out);
        //     } else {
        //         println!("Tried to delete a non-existant socket from exchanges list");
        //     }
        // }
    }
}
