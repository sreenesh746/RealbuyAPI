var fs= require('fs');
var log = require('../logger');
const fileType = require('file-type');
var async = require('async');
var forEach = require('async-foreach');
//TODO: please use a named function
module.exports = function(req,res,next){

    var processResults = function(callback) {
        async.forEach(req.result, function(item, callback) {
            if(item.photo) {
                var data = fs.readFileSync(item.photo);
                var base64data = 'data:'+fileType(data).mime+',';
                base64data+= new Buffer(data).toString('base64');
                item.photo=base64data;
            }
                callback();
        }, 
        function(err) {
            if(err)
                log.error(err);
            callback(undefined,req.result)
        });
    };
    processResults(function(err, result) {
        if(err)
            log.error(err);
        log.info('Processed images to be served');
        res.json(result);
    });
};