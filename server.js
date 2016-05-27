var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{								// not using a db so add todos to a var
	id: 			1, 
	description: 	'Meet mom for lunch',
	completed:   	false  

}, {
	id: 			2, 
	description: 	'Go to market',
	completed:   	false  	
}, {
	id: 			3, 
	description: 	'Get a life',
	completed:   	true  	
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);				// Pass in todos array. Gets converted to json then sent to caller
});

// GET /todos/:id  (:id represents var that will be passed in)
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);	// gets the id parameter being passed in and saves it to a var after converting from string to int
	var matchedTodo;						

	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	})

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});