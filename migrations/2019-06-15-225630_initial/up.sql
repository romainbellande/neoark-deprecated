-- Your SQL goes here

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

INSERT INTO players (email, username, password) VALUES ('toto', 'toto', 'toto');

CREATE TABLE planets (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    name VARCHAR NOT NULL
);

INSERT INTO planets (player_id, name) VALUES (1, 'toto');

CREATE TABLE inventories (
    id SERIAL PRIMARY KEY,
    planet_id INTEGER REFERENCES planets(id) NOT NULL,
    items VARCHAR NOT NULL,
    last_update TIMESTAMP NOT NULL
);

INSERT INTO inventories (planet_id, items, last_update) VALUES (1, '{}', NOW());

CREATE TABLE processors (
    id SERIAL PRIMARY KEY,
    planet_id INTEGER REFERENCES planets(id) NOT NULL,
    level INTEGER NOT NULL,
    upgrade_finish TIMESTAMP NULL,
    recipe INTEGER NOT NULL
);

INSERT INTO processors (planet_id, level, upgrade_finish, recipe) VALUES (1, 1, NULL, 0);
INSERT INTO processors (planet_id, level, upgrade_finish, recipe) VALUES (1, 1, NULL, 1);
