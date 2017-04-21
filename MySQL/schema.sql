CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("XBox One", "Video Games", 300.00, 100),
("XBox Project Scorpio", "Video Games", 700.00, 20),
("Pogo Stick", "Sports", 50.00, 25),
("Zombie Mask", "Clothing", 20.00, 40),
("G-String", "Clothing", 22.95, 1),
("Colt AR-15", "Weapons", 550.00, 900),
("Liquid Ass", "Pranking", 10.00, 74),
("Kazoo Kid's Red Kazoo", "Meme Materials", 9001.00, 1),
("Harambe Cheeto", "Meme Materials", 99900.00, 1),
("Dank Weed", "Consumables", 0.05, 420000); 

SELECT * FROM products;