var restify = require('restify');
var config = require('./settings/config');
var log = require('./logger');
var app = restify.createServer({
    name: 'Realbuy-api',
    log : log
});

app.pre(function (request, response, next) {
    request.log.info({ req: request }, 'REQUEST');
    next();
});

var cors = require('cors');

app.use(restify.fullResponse());
app.use(restify.bodyParser({
    auto: { 
        fields: true
    },
    multipart: true, 
    urlencoded: true, 
    encoding: 'utf8',
    keepExtensions: true, 
    mapparams: true 
}));
app.use(cors());
app.use(restify.queryParser());
app.listen(config.port, function() {
    console.log('server listening on port number', config.port);
});
var routes = require('./routes')(app);
