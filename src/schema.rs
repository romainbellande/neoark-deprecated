table! {
    inventories (id) {
        id -> Int4,
        planet_id -> Int4,
        items -> Varchar,
        last_update -> Timestamp,
    }
}

table! {
    planets (id) {
        id -> Int4,
        player_id -> Int4,
        name -> Varchar,
    }
}

table! {
    players (id) {
        id -> Int4,
        email -> Varchar,
        username -> Varchar,
        password -> Varchar,
    }
}

table! {
    processors (id) {
        id -> Int4,
        player_id -> Int4,
        planet_id -> Int4,
        level -> Int4,
        upgrade_finish -> Nullable<Timestamp>,
        ratio -> Numeric,
        rate -> Numeric,
        net_rate -> Numeric,
        recipe -> Int4,
    }
}

joinable!(inventories -> planets (planet_id));
joinable!(planets -> players (player_id));
joinable!(processors -> planets (planet_id));
joinable!(processors -> players (player_id));

allow_tables_to_appear_in_same_query!(
    inventories,
    planets,
    players,
    processors,
);
