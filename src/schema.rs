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

joinable!(planets -> players (player_id));

allow_tables_to_appear_in_same_query!(
    planets,
    players,
);
