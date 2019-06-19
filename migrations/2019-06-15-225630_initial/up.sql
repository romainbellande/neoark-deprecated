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
    player_id INTEGER REFERENCES players(id) NOT NULL,
    planet_id INTEGER REFERENCES planets(id) NOT NULL,
    items VARCHAR NOT NULL,
    last_update TIMESTAMP NOT NULL
);

INSERT INTO inventories (player_id, planet_id, items, last_update) VALUES (1, 1, '{"0":10000,"1":10000, "3": 1000}', NOW());

CREATE TABLE processors (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    planet_id INTEGER REFERENCES planets(id) NOT NULL,
    level INTEGER NOT NULL,
    upgrade_finish TIMESTAMP NULL,
    ratio DECIMAL(15, 6) NOT NULL,
    user_ratio INTEGER NOT NULL,
    recipe INTEGER NOT NULL
);

-- miners
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 30, NULL, 1.0, 100, 0);
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 30, NULL, 1.0, 100, 1);
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 30, NULL, 1.0, 100, 2);

-- elec
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 50, NULL, 1.0, 100, 3);

-- intermediary
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 5, NULL, 1.0, 100, 5);
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 9, NULL, 1.0, 100, 6);
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 10, NULL, 1.0, 100, 7);

-- science pack
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 2, NULL, 1.0, 100, 4);

-- lab
INSERT INTO processors (player_id, planet_id, level, upgrade_finish, ratio, user_ratio, recipe) VALUES (1, 1, 1, NULL, 1.0, 100, 8);

CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    planet_id INTEGER REFERENCES planets(id) NOT NULL,
    current_research INTEGER NOT NULL,
    current_progress DECIMAL(15, 6) NOT NULL,
    searched VARCHAR NOT NULL,
    last_update TIMESTAMP NOT NULL
);

INSERT INTO technologies (player_id, planet_id, current_research, current_progress, searched, last_update) VALUES (1, 1, -1, 0, '{}', NOW());
