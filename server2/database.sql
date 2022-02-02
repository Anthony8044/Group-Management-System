CREATE DATABASE gms;

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

--insert fake users
INSERT INTO users (name, email, password) VALUES ('Bob Ross', 'anthonystoltzfus@gmail.com', '123123' );