CREATE TABLE app.public.users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  pasaword VARCHAR(255) NOT NULL
);

CREATE TABLE app.public.biodata (
    id SERIAL PRIMARY KEY,
    genre VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    height INT NOT NULL,
    goal VARCHAR(255) NOT NULL,
    activity VARCHAR(255) NOT NULL,
    c_weight INT NOT NULL,
    d_weight INT NOT NULL,
    weeks INT NOT NULL
);

