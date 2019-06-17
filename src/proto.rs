use bigdecimal::BigDecimal;
use serde_derive::*;
use std::collections::HashMap;
use ws::Message;
use std::time::SystemTime;

use super::models::Player;
use super::models::Planet;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "message")]
pub enum Packet {
    Login {
        username: String,
        password: String,
    },
    Logout,
    Register {
        username: String,
        password: String,
        email: String,
    },
    SessionLogin {
        hash: String,
    },
    // Account {
    //     user: User,
    //     wallets: Vec<Wallet>,
    // },
    // Initial {
    //     exchanges: Vec<Exchange>,
    //     currencies: Vec<Currency>,
    // },

    ///
    Error {
        msg: String,
    },
}

impl Packet {
    pub fn to_message(&self) -> Message {
        Message::Text(json!(self).to_string())
    }

    pub fn error(reason: &str) -> Message {
        Packet::Error {
            msg: reason.to_string(),
        }
        .to_message()
    }
}
