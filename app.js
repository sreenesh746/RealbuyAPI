var restify = require('restify');
var config = require('./settings/config');
var log = require('./logger');
var cors = require('cors');
var app = restify.createServer({
    name: 'Realbuy-api',
    log: log
});

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
app.pre(cors());
app.use(restify.queryParser());
app.listen(config.port,config.server_ip_address, function() {
    console.log('server listening on port number', config.port);
});

var routes = require('./routes')(app);