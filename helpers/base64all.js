var fs= require('fs');
const fileType = require('file-type');
var async = require('async');
var forEach = require('async-foreach')
var mime = require('mime-types');
module.exports = function(req,res,next){

    var processResults = function(callback) {
        async.forEach(req.results, function(result, callback) {
            async.forEach(result, function(item, callback) {
                if(item.photo) {
                    var data = fs.readFileSync(item.photo);
                    //console.log(mime.lookup(data));
                    console.log(item.photo);
                    console.log(fileType(data).mime);
                    var base64data = 'data:'+fileType(data).mime+',';
                    base64data+= new Buffer(data).toString('base64');
                    item.photo=base64data;
                }
                callback();
            }, 
            function(err) {
                callback();
            });
        }, 
        function(err) {
            callback(undefined, req.results);
        });
    };

    processResults(function(err, results) {
        res.json({
            featured: results[0],
            commercial: results[1],
            furnishedHomes: results[2],
            landAndPlot: results[3],
            rental: results[4],
			favourites: results[5]
        });
    });
};







    
