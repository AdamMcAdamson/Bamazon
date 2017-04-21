var mysql = require('mysql');

var inquirer = require('inquirer');
var Table = require('cli-table');



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

function printProducts(){
	var outString = '';
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;

		console.log(res);
		for(var i = 0; i < res.length; i ++){
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		print();
	});
}


function print(){
	console.log(table.toString());		
}

printProducts();