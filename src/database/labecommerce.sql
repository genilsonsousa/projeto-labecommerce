-- Active: 1680020986317@@127.0.0.1@3306
CREATE TABLE users (
     id TEXT PRIMARY KEY UNIQUE NOT NULL,
     email TEXT  UNIQUE NOT NULL,
      password TEXT  NOT NULL
      );

INSERT INTO users VALUES 
( "01","joana@email.com","123456"),
( "02","maria@email.com","123465"),
( "03","joao@email.com","124356"),
( "04","matheus@email.com","213456"),
( "05","luana@email.com","123056"),
( "06","fernando@email.com","923456"),
( "07","lucas@email.com","773456"),
( "08","ana@email.com","1255456"),
( "09","juju@email.com","623456"),
( "10","flavia@email.com","113456");

SELECT * FROM users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);


INSERT INTO products VALUES 
("088", "relogio", 288.00, "ACCESSORIES"),
("034", "camisa", 48.00, "CLOTHES_AND_SHOES"),
("090", "celular", 900.00, "ELECTRONICS"),
("078", "oculos", 88.00, "ACCESSORIES"),
("008", "sapato", 68.00, "CLOTHES_AND_SHOES"),
("028", "mouse", 28.00, "ELECTRONICS"),
("038", "colar", 58.00, "ACCESSORIES"),
("018", "blusa", 18.00, "CLOTHES_AND_SHOES"),
("054", "fone", 45.00, "ELECTRONICS"),
("024", "pulseira", 20.00, "ACCESSORIES");

SELECT * FROM products;