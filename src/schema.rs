table! {
    inventories (id) {
        id -> Int4,
        player_id -> Int4,
        planet_id -> Int4,
        items -> Varchar,
        last_update -> Timestamp,
    }
}

table! {
    movements (id) {
        id -> Int4,
        sender_player_id -> Int4,
        receiver_player_id -> Int4,
        sender_planet_id -> Int4,
        receiver_planet_id -> Int4,
        ships -> Varchar,
        resources -> Varchar,
        speed -> Int4,
        intention -> Int4,
        arrival_time -> Timestamp,
    }
}

table! {
    planets (id) {
        id -> Int4,
        player_id -> Int4,
        name -> Varchar,
        position -> Varchar,
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
        user_ratio -> Int4,
        recipe -> Int4,
    }
}

table! {
    technologies (id) {
        id -> Int4,
        player_id -> Int4,
        planet_id -> Int4,
        current_research -> Int4,
        current_progress -> Numeric,
        searched -> Varchar,
        last_update -> Timestamp,
    }
}

joinable!(inventories -> planets (planet_id));
joinable!(inventories -> players (player_id));
joinable!(planets -> players (player_id));
joinable!(processors -> planets (planet_id));
joinable!(processors -> players (player_id));
joinable!(technologies -> planets (planet_id));
joinable!(technologies -> players (player_id));

allow_tables_to_appear_in_same_query!(
    inventories,
    movements,
    planets,
    players,
    processors,
    technologies,
);
