table! {
    planets (id) {
        id -> Int4,
        player_id -> Int4,
        name -> Varchar,
        iron_mine -> Int4,
    }
}

table! {
    players (id) {
        id -> Int4,
        username -> Varchar,
        password -> Varchar,
    }
}

joinable!(planets -> players (player_id));

allow_tables_to_appear_in_same_query!(
    planets,
    players,
);
