var fs= require('fs');
const fileType = require('file-type');
var async = require('async');
var forEach = require('async-foreach');
module.exports = function(req,res,next){

    var processResults = function(callback) {
        async.forEach(req.result, function(item, callback) {
            if(item.photo) {
                var data = fs.readFileSync(item.photo);
                console.log(fileType(data));
                var base64data = 'data:'+fileType(data).mime+',';
                base64data+= new Buffer(data).toString('base64');
                item.photo=base64data;
            }
                callback();
        }, 
        function(err) {
            callback(undefined,req.result)
        });
    };
    processResults(function(err, result) {
        console.log(result);
        res.json(result);
    });
};