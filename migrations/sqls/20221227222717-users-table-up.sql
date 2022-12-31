/* Replace with your SQL commands */
CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    firstname VARCHAR(250),
    lastname VARCHAR(250),
    username VARCHAR(250),
    password_digest TEXT
);