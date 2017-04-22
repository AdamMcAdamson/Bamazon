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
	head: ["Department Id", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"],
	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
	'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
	'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
	'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

var startOptionsQs = [new Question('list', 'choice', 'What would you like to do?', ['View Product Sales by Department', 'Create New Department', 'Close'])];

var createDepartmentQs = [
	new Question('input', 'name', 'What is the department\'s name? '),
	new Question('input', 'overHeadCosts', 'What is the department\'s total over head cost? '),
	new Question('input', 'totalSales', 'What is the department\'s total sales? ')
];

supervisorActivity();

function supervisorActivity(){
	inquirer.prompt(startOptionsQs).then(function(answers){
		switch(answers.choice){
			case 'View Product Sales by Department':
				viewDepartmentSales();
				break;
			case 'Create New Department':
				createDepartment();
				break;
			case 'Close':
				process.exit();
				break;
			default:
				console.log('Unexpected Choice: ' + answers.choice);
		}
	});
}

function viewDepartmentSales(){
	table.splice(0);
	connection.query('SELECT * FROM departments', function(err, res){
		if (err) throw err;

		for(var i = 0; i < res.length; i ++){
			var profits = res[i].total_sales - res[i].over_head_costs;
			table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, profits]);
		}
		console.log(table.toString());
		supervisorActivity();
	});
}

function createDepartment(){
	inquirer.prompt(createDepartmentQs).then(function(answers){
		connection.query('INSERT INTO departments (department_name, over_head_costs, total_sales) VALUES (?, ?, ?)', [answers.name, parseFloat(answers.overHeadCosts), parseFloat(answers.totalSales)], function(err, res){
			if(err) throw err;
			console.log('The ' + answers.name + ' department was added successfully!');
			supervisorActivity();
		});
	});
}

function Question(type, name, message, choices){
	this.type = type;
	this.name = name;
	this.message = message;
	this.choices = choices;
}