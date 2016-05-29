// need to install these by either running e.g. $ npm install body-parser@1.13.3 --save. 
// saves them locally and inserts into package.json
// or can add them into package.json by name and then run $ npm install
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

// since not working with a db need todoNextId
var todos = [];
var todoNextId = 1;			

// sets up middleware. if json request comes in express parses it and can access it via req.body
app.use(bodyParser.json());

// purely to test if the app is working at first deply (locally & on heroku) by testing root route
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
// Pass in todos array. Gets converted to json then sent to caller
app.get('/todos', function (req, res) {
	res.json(todos);				
});

// GET /todos/:id  
// Shorter/better code using underscore library (:id represents var that will be passed in)
// parsetInt etc.: gets the id parameter being passed in and saves it to a var after converting from string to int 
// second arg (10) to convert to int using base 10. Virtually aways this
// _.findwhere looks in first arg (todos) and returns the first matching item (here where id equals tododId)
// if (matchedTodo) is true if matchedTodo exists ie is not undefined
// res.json(matchedTodo) takes matchedTodo, converts it to json, and passes it as the response
// if no matching id is found, returns a 404 NOT FOUND message
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);	
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});

// POST /todos
// adding validation and not allowing other fields to be passed by user
// _.pick: only picks the specified fields and ignores others user might submit (e.g. hacking/sql injection)
// req.body accesses the body/parameters passed in (only those allowed by _.pick)
// body.completed accesses the completed attribute passed in; body.description accesses the description passed in
// if data doesn't pass validation returns a 400 BAD REQUEST message
// trims the description (removes spaces at beginning or end of description) before saving it
// body.id = todoNextId++;	sets the body.id as todoNextId and then increments it
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	
	body.description = body.description.trim();
	body.id = todoNextId++;

	todos.push(body);
	res.json(body);
});

// DELETE /todos/:id
// see explanations in /todos/:id since uses some same code to find the item
// _.without(todos, matchedTodo); returns todos having removed matchedTodo
// if no matching id is found, returns a 404 NOT FOUND message
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).json({"error": "no todo found with id: " + todoId});
	}
});


// PUT /todos/:id
// Updates a todo
// Shares code with GET /todos/:id and POST /todos (see notes re first 3 lines of code)
// when update matchedTodo it updates it within the array it is in as well (see response below to my question)
// "Objects in JavaScript are passed by reference. This means anytime we update matchedTodo, we are updating ..
// .. the same thing that's stored in our array of todos.""

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};					// var in which valid attributes stored after they have been validated

	if (!matchedTodo) {							// if no matched to do has been found send back 404 NOT FOUND message
		return res.status(404).send();			// using return stops the function running (I think)
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();			// must be providing a non-boolean, so 400 BAD REQUEST message
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);		// underscore extend method replaces existing attributes with new ones where there are new ones
	res.json(matchedTodo);						// sends back the now updated record
});

// SETUP EXPRESS SERVER. CONVENTION PLACES THIS AT BOTTOM OF FILE
app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});










