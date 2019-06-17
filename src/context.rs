use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use ws::Sender;

use super::models::*;

#[derive(Clone, Debug)]
pub struct Context {
    pub clients: HashMap<i32, Sender>,
    pub redis: redis::Client,
}

impl Context {
    pub fn new() -> Context {
        let redis = redis::Client::open("redis://127.0.0.1/").unwrap();

        Context {
            clients: HashMap::new(),
            redis,
        }
    }

    pub fn new_shared() -> Arc<RwLock<Context>> {
        Arc::new(RwLock::new(Context::new()))
    }
}
