var mongoose = require('mongoose');
var config = require('./config');
var url = config.dbPath;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}


mongoose.connect(url);
var db = mongoose.connection;

db.on('error', function() {
    console.log('error occured from db');
});

db.once('open', function dbOpen() {
    console.log('successfully opened the db');
});

exports.mongoose = mongoose;