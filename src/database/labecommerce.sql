-- Active: 1680214597313@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT  UNIQUE NOT NULL,
    password TEXT  NOT NULL,
    create_at TEXT NOT NULL 
);

   DROP TABLE users;   

INSERT INTO users VALUES 
( "01","joana@email.com","123456","2023-04-04 10:24:00"),
( "02","maria@email.com","123465","2023-04-04 10:24:00"),
( "03","joao@email.com","124356", "2023-04-04 10:24:00"),
( "04","matheus@email.com","213456", "2023-04-04 10:24:00"),
( "05","luana@email.com","123056", "2023-04-04 10:24:00"),
( "06","fernando@email.com","923456", "2023-04-04 10:24:00"),
( "07","lucas@email.com","773456", "2023-04-04 10:24:00"),
( "08","ana@email.com","1255456", "2023-04-04 10:24:00"),
( "09","juju@email.com","623456", "2023-04-04 10:24:00"),
( "10","flavia@email.com","113456", "2023-04-04 10:24:00");

SELECT * FROM users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

DROP TABLE products;


INSERT INTO products VALUES 
("088", "relogio", 288.00, "ACCESSORIES", "imagem"),
("034", "camisa", 48.00, "CLOTHES_AND_SHOES", "imagem"),
("090", "celular", 900.00, "ELECTRONICS", "imagem"),
("078", "oculos", 88.00, "ACCESSORIES", "imagem"),
("008", "sapato", 68.00, "CLOTHES_AND_SHOES", "imagem"),
("028", "mouse", 28.00, "ELECTRONICS", "imagem"),
("038", "colar", 58.00, "ACCESSORIES", "imagem"),
("018", "blusa", 18.00, "CLOTHES_AND_SHOES", "imagem"),
("054", "fone", 45.00, "ELECTRONICS", "imagem"),
("024", "pulseira", 20.00, "ACCESSORIES", "imagem");

SELECT * FROM products;

SELECT (name) FROM products;

SELECT * FROM products WHERE name LIKE "%relogio%";

INSERT INTO users VALUES("11", "fefe@email.com", "745362859");

INSERT INTO products VALUES("768","anel", 30.00, "ACCESSORIES");

SELECT * FROM products WHERE id="034";

DELETE FROM users WHERE id="11";

DELETE FROM products WHERE id="768";

UPDATE users 
SET
 id="11" 
  WHERE id="10";

UPDATE products
SET
 price=100.00 
  WHERE id="078";

SELECT * FROM users ORDER BY email ASC;
SELECT * FROM products ORDER BY price ASC LIMIT 20 OFFSET 0;

-- SELECT * FROM products WHERE price BETWEEN 18.00 AND 58.00 ORDER BY price ASC; --não funcionou , o AND não roda , so o OR
SELECT * FROM products WHERE price>=18.00 AND price<=58.00 ORDER BY price ASC; --não funcionou , o AND não roda , so o OR

CREATE Table purchasess (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
 total_price REAL NOT NULL,
 paid INTEGER NOT NULL,
 create_at TEXT NOT NULL ,
 buyer_id TEXT NOT NULL,
 FOREIGN KEY (buyer_id) REFERENCES users (id) 
);

DROP TABLE purchasess;

INSERT INTO purchasess (id,total_price,paid,create_at, buyer_id) VALUES
("c001", 29.0, 0,"2023-04-04 10:24:00", "01" ),
("c002", 39.0,1,"2023-04-04 10:24:00", "02" ),
("c003", 50.0,0,"2023-04-04 10:24:00", "03" ),
("c004", 79.0,1,"2023-04-04 10:24:00", "04" );

UPDATE purchasess SET delivered_at= DATETIME("2023-04-04 10:24:00") WHERE id="c004";
UPDATE purchasess SET delivered_at= DATETIME("2023-04-04 10:24:00") WHERE id="c003";
UPDATE purchasess SET delivered_at= DATETIME("2023-04-04 10:24:00") WHERE id="c002";
UPDATE purchasess SET delivered_at= DATETIME("2023-04-04 10:24:00") WHERE id="c001";


SELECT * FROM purchasess;

SELECT p.id, p.total_price, p.paid, p.delivered_at, p.buyer_id, u.id, u.email 
FROM purchasess AS p 
INNER JOIN users AS u
ON u.id=p.buyer_id;


CREATE TABLE purchases_products (
  purchase_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT(1),
  FOREIGN KEY (purchase_id) REFERENCES purchasess(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

DROP TABLE purchases_products;

INSERT INTO purchases_products(purchase_id , product_id, quantity) VALUES
("c001","088", 2),
("c002","018", 1),
("c003","024", 2);

SELECT * FROM purchases_products;

SELECT
products.id  AS "id do produto",
products.name AS "nome do produto" ,
products.price AS "preço do produto",
purchasess.id AS "id da compra" , 
purchasess.total_price AS "total da compra " 
FROM purchases_products
INNER JOIN purchasess ON purchases_products.purchase_id=purchasess.id
INNER JOIN products ON purchases_products.product_id=products.id;

