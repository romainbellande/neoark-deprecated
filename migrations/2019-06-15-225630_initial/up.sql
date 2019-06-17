-- Your SQL goes here

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE planets (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    name VARCHAR NOT NULL,
    iron_mine INTEGER NOT NULL
);
