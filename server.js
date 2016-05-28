var express = require('express');
var bodyParser = require('body-parser'); // need to first run $ npm install body-parser@1.13.3 --save (for post todos)
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;						// since not working with a db

// sets up middleware 
app.use(bodyParser.json());			// if json request comes in express parses it and can access it via req.body

// purely to test if the root url is working (locally & on heroku)
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);				// Pass in todos array. Gets converted to json then sent to caller
});

// GET /todos/:id  SHORTER/BETTER CODE USING UNDERSCORE (:id represents var that will be passed in)
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);	// gets the id parameter being passed in and saves it to a var after converting from string to int
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});

// POST /todos ADDING VALIDATION & NOT ADDING OTHER FIELDS
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');			// only picks these fields, not others user might submit

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	
	body.description = body.description.trim();							// to get rid of unwanted spaces at beginning or end
	body.id = todoNextId++;

	todos.push(body);
	res.json(body);
});


// SETUP EXPRESS SERVER. CONVENTION PLACES THIS AT BOTTOM OF FILE
app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});










