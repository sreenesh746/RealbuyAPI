var restify = require('restify');
var config = require('./config');
var app = restify.createServer({name:'Realbuy-api'});
var cors = require('cors');

app.use(restify.fullResponse());
app.use(restify.bodyParser({
	auto: { // Automatic parsing 
		fields: true
	},
	multipart: true, // Multipart content parsing 
	urlencoded: true, // Urlencoded content parsing 
	encoding: 'utf8', // Default encoding 
	keepExtensions: true, // keep extensions for multipart data
	mapparams: true		// to user req.params
}));
app.use(cors());
app.use(restify.queryParser());
app.listen(config.port, function() {
	console.log('server listening on port number', config.port);
});
var routes = require('./routes')(app);
