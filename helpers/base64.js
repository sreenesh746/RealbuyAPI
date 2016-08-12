var fs= require('fs');
var log = require('../logger');
const fileType = require('file-type');
var async = require('async');
var forEach = require('async-foreach');

module.exports.toBase64 = function(result,res){

    var processResults = function(callback) {
        async.forEach(result, function(item, callback) {
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
            callback(undefined,result)
        });
    };
    processResults(function(err, result) {
        if(err)
        {
            log.error(err);
            res.json(500,{error:err});
        }
        log.info('Processed images to be served');
        res.json(result);
    });
};