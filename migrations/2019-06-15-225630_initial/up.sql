-- Your SQL goes here

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE planets (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    name VARCHAR NOT NULL
);

-- CREATE TABLE inventories (
--     id SERIAL PRIMARY KEY,
--     player_id INTEGER REFERENCES players(id) NOT NULL,
--     planet_id INTEGER REFERENCES planets(id) NOT NULL,
-- );

-- CREATE TABLE items (
--     id SERIAL PRIMARY KEY,
--     name INTEGER REFERENCES players(id) NOT NULL,
--     recipe_id
--      INTEGER REFERENCES players(id) NOT NULL,
--     inventory_id INTEGER REFERENCES inventories(id) NOT NULL,
-- );

