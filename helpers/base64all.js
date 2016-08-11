var fs= require('fs');
var log = require('../logger');
const fileType = require('file-type');
var async = require('async');
var forEach = require('async-foreach')
var mime = require('mime-types');
//TODO: Named function please, done
module.exports.toBase64 = function(results,res,favourites){

    var processResults = function(callback) {
        async.forEach(results, function(result, callback) {
            async.forEach(result, function(item, callback) {
               /* if(item.photo) {
                    var data = fs.readFileSync(item.photo);
                    var base64data = 'data:'+fileType(data).mime+',';
                    base64data+= new Buffer(data).toString('base64');
                    item.photo=base64data;
                }*/
                callback();
            }, 
            function(err) {
                if(err)
                    log.error(err);
                callback();
            });
        }, 
        function(err) {
            if(err)
                log.error(err);
            callback(undefined, results,favourites);
        });
    };

    processResults(function(err, results,favourites) {
        if(err)
        {
            log.error(err);
            res.json(500,{error:err});
        }
        log.info('Images processed successfully');
        res.json({
            featured: results[0],
            commercial: results[1],
            furnishedHomes: results[2],
            landAndPlot: results[3],
            rental: results[4],
			favourites: favourites
        });
    });
};







    
