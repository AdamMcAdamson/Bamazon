var mysql = require('mysql');

var inquirer = require('inquirer');
var Table = require('cli-table');

var customerQuestions = [
	new Question('input', 'itemId', 'What is the id of the item you would like to purchase? '),
	new Question('input', 'numPurchase', 'How many would you like to buy? ')
];

var continueQuestion = [new Question('confirm', 'again', 'Would you like to make another purchase? ')];

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



printProducts(getPurchase);

function getPurchase(){
	inquirer.prompt(customerQuestions).then(function(answers){
		if(answers.numPurchase <= 0){
			console.log('That is an invalid purchase amount. Please try again.');
			getPurchase();
			return;
		}
		else {

			connection.query('SELECT * FROM products WHERE item_id = ?', [answers.itemId], function(err, res){
				if (err) throw err;

				if(res.length > 0){
					if(res[0].stock_quantity >= answers.numPurchase){
						var newStockQuantity = res[0].stock_quantity - parseInt(answers.numPurchase);
						var cost = parseInt(answers.numPurchase) * res[0].price;
						var newProductSales = res[0].product_sales + cost;
						connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStockQuantity, answers.itemId], function(err, updateRes){
							if (err) throw err;
							connection.query('SELECT total_sales FROM departments WHERE department_name = ?', [res[0].department_name], function(err, departmentsRes){
								if(err) throw err;
								var newTotalSales = departmentsRes[0].total_sales + cost;
								connection.query('UPDATE departments SET total_sales = ? WHERE department_name = ?', [newTotalSales, res[0].department_name],function(err, departmentsUpdateRes){
									if(err) throw err;
									console.log("Thank you for your purchase!\nYou bought " + parseInt(answers.numPurchase) + " " + res[0].product_name + ", totalling to $" + cost + '.');
									inquirer.prompt(continueQuestion).then(function(answers2){
										if(answers2.again){
											printProducts(getPurchase);
										}
										else {
											console.log('Have a nice day!');
											process.exit();
										}
									});
								});
							});
						});
					}
					else {
						console.log('We cannot complete your order due to insufficient quantity. Please try again.');
						getPurchase();
					}
				}
				else {
					console.log('We cannot complete your order. The item specified was not found, please try again.');
					getPurchase();
				}
			});
		}
	});
}

function printProducts(callback){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;

		table.splice(0);
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