CREATE DATABASE bamazon_DB;

USE bamazon_db;

CREATE table products(
id integer(10)AUTO_INCREMENT NOT NULL, 
productName VARCHAR(50) NOT NULL ,
department VARCHAR(50) NULL, 
price INTEGER(10) NOT NULL,
stock_quantity INTEGER(10), 
PRIMARY KEY (id));


INSERT INTO products(productName, department, price, stock_quantity)
VALUES ( "Nike Running Shoes", "shoes", 29, 10) , ("Summer dress", "clothing" , 30 , 10), ("Tony Hawk SkateBoard", "outdoor", 25 , 5) , (" Red LipStick", "makeup", 5, 20), 
("diapers", "baby", 20, 10), ("Drum set", "music", 100, 3) , ("Power ranger action fiqure", "toys", 5, 15), ("Batman mask", "Holiday", 10, 25);




USE bamazon_DB;
SELECT * FROM products 
