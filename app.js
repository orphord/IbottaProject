/**
 * Node.js app for the Ibotta interview take-home project
 * author: Jeff Orford
 */
var express = require('express');
var app = express();
var routes = require('./routes');
var lib = require('./library');
var bodyParser = require('body-parser');

// Initialize dictionary from file
lib.initDictionary();

// Some middleware to be able to handle POST-ed JSON data
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(3000, function() {
	console.log('Ibotta take-home app listening on port 3000');
});

