// all the requires
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var randomGreek = require('random-greek-gods');
var math = require('mathjs');

// this is the whole app
var app = express();

// websocket server
var expressWs = require('express-ws')(app);

// this server gonna run on this port
app.set('port', 8080);

// global variables
history = [];
clients = [];

// pug settings
app.set('views','./views');
app.set('view engine', 'pug');

// verbose logging
app.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});

// websocket functions
expressWs.getWss().on('connection', function(ws) {
	// on new connection: generate index and id
	var index=clients.push(ws) - 1;
	var id=randomGreek();
	ws.send('id='+id); // let the client know their id
	console.log('connected:',id,index);
	// broadcast current history
	for (var i=0; i < history.length; i++){
		ws.send(history[i].id + ': ' + history[i].eq + ' result=' + history[i].result);
	}

	// on message
	ws.on('message', function incoming(eq) {
		// calculate
		result="";
		error="";
		try {
			result=math.eval(eq);
		}
		catch (err) {
			result='ERR';
			error=err.message;
		}

		if (error!=""){
			// send error
			ws.send('ERR! '+error);
		} else {
			// put in history
			entry = {
				id: id,
				eq: eq,
				result: result
			}
			history.push(entry);
			// check bounds
			if (history.length>10) history.shift();
			// broadcast msg to everyone
			for (var i=0; i < clients.length; i++){
				clients[i].send(id + ': ' + eq + ' result=' + result);
			}
		}
	});

	// on close connection
	ws.on('close', function closing(code, reason) {
		console.log('disconnected:',id,index);
		// remove from client lists
		clients.splice(index,1);
	});
});

app.ws('/ws', function(ws, req) {
	// dont remove this
});

// static directory
app.use(express.static(path.join(__dirname, 'static')));
// node modules
app.use('/node_modules', express.static(path.join(__dirname,'/node_modules')));

// front end
app.get('/', function(req,res){
	res.render('index', {title: 'Hello World', message: 'Hello there!' });
})

// Listen for requests
var server = app.listen(app.get('port'), function(){
	var port = server.address().port;
	console.log("Magic happens on port " + port);
});