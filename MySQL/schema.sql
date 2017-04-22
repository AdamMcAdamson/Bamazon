CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(11,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(12,2) DEFAULT 0
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("XBox One", "Video Games", 300.00, 100, 0),
("XBox Project Scorpio", "Video Games", 700.00, 20, 0),
("Pogo Stick", "Sports", 50.00, 25, 0),
("Zombie Mask", "Clothing", 20.00, 40, 0),
("G-String", "Clothing", 22.95, 1, 0),
("Colt AR-15", "Weapons", 550.00, 900, 0),
("Liquid Ass", "Pranking", 10.00, 74, 0),
("Kazoo Kid's Red Kazoo", "Meme Materials", 9001.00, 1, 0),
("Harambe Cheeto", "Meme Materials", 99900.00, 1, 0),
("Dank Weed", "Consumables", 0.05, 420000, 0); 

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(12,2) DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0
);

INSERT INTO departments (department_name, over_head_costs, total_sales)
VALUES ("Video Games", 25000, 30000),
("Sports", 50000, 2000),
("Clothing", 1000, 245000),
("Weapons", 10000, 20000),
("Pranking", 200, 250),
("Meme Materials", 20, 0),
("Consumables", 20000, 420420420);

SELECT * FROM products;

SELECT * FROM departments;