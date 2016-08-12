var fs = require('fs');
var log = require('../logger');
var async = require('async');
var base64 = require('./base64');
var base64all = require('./base64all');
var property = require('../models/property');
var user = require('../models/user');

function propertyDbHelper() {

    this.addProperty = function(req, res) {
        var propertyDetails = req.params;
        console.log(req.files.photo);
        var filename = req.files.photo.name;
        propertyDetails.owner = req.user._id;
        location = [propertyDetails['lng'], propertyDetails['lat']];
        delete propertyDetails['lng'];
        delete propertyDetails['lat'];
        propertyDetails['location'] = location;
        var currentDateTime=Date.now();
        propertyDetails['photo'] = './uploads/properties/' + currentDateTime + filename;
        log.info(propertyDetails);
        var newProperty = new property(propertyDetails);
        newProperty.save(function(err, result) {
            if (err) {
                log.error(err);
                return res.json(400,{
                    error: err
                });
            } else {
                fs.rename(req.files.photo.path, propertyDetails['photo'], function(err) {
                    if (err)
                        log.error(err);
                });
                log.info('property added');
                res.json({
                    status: true,
                    message: 'successfully saved'
                });
                user.findOneAndUpdate({
                        _id: result.owner
                    }, {
                        $push: {
                            properties: result._id
                        }
                    }, {},
                    function(err, result) {
                        if (err) {
                            log.error(err);
                            return res.json({
                                'error': err
                            });
                        } else {
                            log.info('property added to owner');
                            return res.json({
                                'status': 'successfully saved'
                            });
                        }
                    });
            }
        });
    };

    this.search = function(req, res) {
        property.find({
            $and: [{
                $or: [{
                    saleType: req.params.option
                }, {
                    availability: req.params.option
                }]
            }, {
                $text: {
                    $search: req.params.keywords
                }
            }]
        },
        function(err, result) {
            if (err) {
                log.error(err);
                return res.json(500,{
                    error: err
                });
            } else {
                log.info('Search successful');
                req.result = result;
                base64.toBase64(result, res);
            }
        });
    };

    this.featuredProperties=function(req, res) {
        property.find({}).skip(req.params.page * 6).limit(6).sort({
            favCount: -1
        }).exec(function(err, result) {
            if (err) {
                log.error(err);
                return res.json(500,{
                    error: err
                });
            }
            log.info('featured properties fetched from database');
            base64.toBase64(result, res);
        });
    };

    this.getProperties=function(req, res) {
        async.parallel([
                function(callback) {
                    property.find({}).limit(6).exec(callback);
                },
                function(callback) {
                    property.find({
                        propertyType: 'COMMERCIAL'
                    }).sort({
                        addedOn: -1
                    }).limit(9).exec(callback);
                },
                function(callback) {
                    property.find({
                        propertyType: 'FURNISHED HOMES'
                    }).sort({
                        addedOn: -1
                    }).limit(9).exec(callback);
                },
                function(callback) {
                    property.find({
                        propertyType: 'LAND AND PLOT'
                    }).sort({
                        addedOn: -1
                    }).limit(9).exec(callback);
                },
                function(callback) {
                    property.find({
                        propertyType: 'RENTAL'
                    }).sort({
                        addedOn: -1
                    }).limit(9).exec(callback);
                }
            ],
            function(err, results) {
                log.info('Properties fetched from database');
                if(req.user)
                    base64all.toBase64(results, res, req.user.favourites);
                else
                    base64all.toBase64(results, res, null);
            });
    };
    return this;
}


module.exports = new propertyDbHelper();