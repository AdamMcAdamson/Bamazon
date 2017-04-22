var mysql = require('mysql');

var inquirer = require('inquirer');
var Table = require('cli-table');

var startOptionsQs = [new Question('list', 'choice', 'What would you like to do?', ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Close'])];

var addInventoryQs = [
	new Question('input', 'itemId', 'What is the id of the item you would like to add inventory to?' ),
	new Question('input', 'numToAdd', 'How many would you add? ')
];

var addProductQs = [
	new Question('input', 'name', 'What is the product\'s name? '),
	new Question('input', 'department', 'What is the product\'s department? '),
	new Question('input', 'price', 'What is the price of the product? $'),
	new Question('input', 'amount', 'How many of this item are in stock?')
];

var connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '',
	database: 'bamazon'
});

var table = new Table({
	head: ["Item Id", "Product Name", "Department Name", "Price", "Stock Quantity"],
	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
	'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
	'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
	'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});



managerActivity();

function managerActivity(){
	console.log('\n');
	inquirer.prompt(startOptionsQs).then(function(optAnswers){
		switch (optAnswers.choice){
			case 'View Products for Sale':
				printProducts(managerActivity);
				break;
			case 'View Low Inventory':
				lowProducts(managerActivity);
				break;
			case 'Add to Inventory':
				addInventory();
				break;
			case 'Add New Product':
				addNewProduct()
				break;
			case 'Close':
				process.exit();
				break;
			default:
				console.log('Unexpected Choice: ' + optAnswers.choice);
		}
	});
}

function addInventory(){
	printProducts(function(){
		console.log('\n');
		inquirer.prompt(addInventoryQs).then(function(answers){
			if(parseInt(answers.numToAdd) <= 0){
				console.log('That is an invalid number to add to the item\'s inventory.');
				addInventory();
				return;
			}
			else {
				connection.query('SELECT * FROM products WHERE item_id = ?', [answers.itemId], function(err, res){
					if(err) throw err;
					if(res.length > 0){
						var newStockQuantity = res[0].stock_quantity + parseInt(answers.numToAdd);
						connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStockQuantity, answers.itemId], function(err, updateRes){
							if(err) throw err;
				
							console.log('Successfully added the ' + res[0].department_name + ' to the database.');
							console.log('Successfully added ' + answers.numToAdd + ' ' + res[0].product_name + 's.\nThere are now ' + newStockQuantity + ' ' + res[0].product_name + ' in stock.');
							managerActivity();
						});
					}
				});
			}
		});
	});
}

function addNewProduct(){
	printProducts(function(){
		console.log('\n');
		connection.query('SELECT * FROM departments', function(err, res){
			if(err) throw err;

			var questionArray = [];

			for(var i = 0; i < res.length; i ++){
				questionArray.push(res[i].department_name);
			}

			addProductQs[1] = new Question('list', 'department', 'What is the product\'s department? ', questionArray);

			inquirer.prompt(addProductQs).then(function(answers){
				connection.query('SELECT * FROM departments WHERE department_name = ?', [answers.department], function(err, departmentsRes){
					if(err) throw err;
					if(departmentsRes.length > 0){
						connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', [answers.name, answers.department, parseFloat(answers.price), parseInt(answers.amount)], function(err, res){
							if(err) throw err;
							console.log(answers.name + ' successfully added to the database!');
							managerActivity();
						});
					}
					else {
						console.log("Unknown Department, please try again.");
						addNewProduct();
					}
				});
			});
		});
	});
}

function lowProducts(callback){
	console.log('\n\n\n');
	table.splice(0);
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
		if(err) throw err;

		for(var i = 0; i < res.length; i ++){
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		console.log(table.toString());	
		if(typeof callback === 'function'){
			callback();
		}				
	});
}

function printProducts(callback){
	console.log('\n\n\n');
	table.splice(0);
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;

		for(var i = 0; i < res.length; i ++){
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		console.log(table.toString());	
		if(typeof callback === 'function'){
			callback();
		}	
	});
}


function Question(type, name, message, choices){
	this.type = type;
	this.name = name;
	this.message = message;
	this.choices = choices;
}