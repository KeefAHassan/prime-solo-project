CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR
);

CREATE TABLE habit (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    time TIME,
    frequency VARCHAR,
    reminder INTEGER,
    status VARCHAR,
    user_id INTEGER REFERENCES "user" (id),
    comments VARCHAR
);
