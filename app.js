// all the requires
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

// this is the whole app
var app = express();

// api
var api = require('./api/index.js');

// this server gonna run on this port
app.set('port', 8080);

// pug settings
app.set('views','./views');
app.set('view engine', 'pug');

// logging out all the access
app.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});

// global variables
app.locals.history = [];

// static directory
app.use(express.static(path.join(__dirname, 'static')));
// node modules
app.use('/node_modules', express.static(path.join(__dirname,'/node_modules')));
// enable parser so it can read POST
app.use(bodyParser.urlencoded({ extended: false }));;
app.use(bodyParser.json());

// api
app.use('/api', api);

// front end
app.get('/', function(req,res){
	res.render('index', {title: 'Hello World', message: 'Hello there!' });
})

// Listen for requests
var server = app.listen(app.get('port'), function(){
	var port = server.address().port;
	console.log("Magic happens on port " + port);
});
