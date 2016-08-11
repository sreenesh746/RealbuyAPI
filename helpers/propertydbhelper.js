function propertyDbHelper() {
    var fs = require('fs');
    var log = require('../logger');
    var async = require('async');
    var base64 = require('./base64');
    var base64all = require('./base64all');
    var property = require('../models/property');
    var user = require('../models/user');

    this.addProperty = function(req, res, next) {
        var propertyDetails = req.params;
        propertyDetails.owner = req.user._id;
        location = [propertyDetails['lng'], propertyDetails['lat']];
        delete propertyDetails['lng'];
        delete propertyDetails['lat'];
        propertyDetails['location'] = location;
        var currentDateTime=Date.now();
        propertyDetails['photo'] = './uploads/properties/' + currentDateTime + req.files.photo.name;
        log.info(propertyDetails);
        var newProperty = new property(propertyDetails);
        newProperty.save(function(err, result) {
            if (err) {
                log.error(err);
                return res.json(400,{
                    'error': err
                });
            } else {
                fs.rename(req.files.photo.path, req.propertyDetails['photo'], function(err) {
                    if (err)
                        log.error(err);
                });
                log.info('property added');
                res.json({
                    'status': 'successfully saved'
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

    this.search = function(req, res, next) {
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
                    return res.json({
                        'error': err
                    });
                } else {
                    log.info('Search successful');
                    req.result = result;
                    base64(req, res, next);
                }
            });
    };

    this.featuredProperties=function(req, res, next) {
        property.find({}).skip(req.params.page * 6).limit(6).sort({
            favCount: -1
        }).exec(function(err, result) {
            if (err) {
                log.error(err);
                return res.json({
                    'error': err
                });
            }
            log.info('featured properties fetched from database');
            req.result = result;
            base64(req, res, next);
        });
    };

    this.getProperties=function(req, res, next) {
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
                req.results = results;
                base64all(req, res, next);

            });
    };

    this.getPropertiesAuthorized=function(req, res, next) {
        //TODO: can combine async.parallel of getPropertiesAuthorized and that of getProperties
        async.parallel([
                function(callback) {
                    property.find({}).sort({
                        favCount: -1
                    }).limit(6).exec(callback);
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
                },
                function(callback) {
                    user.find({
                        _id: req.user._id
                    }).select('favourites').exec(callback);
                }
            ],
            function(err, results) {
                log.info('Properties and favourites fetched from database');
                req.results = results;
                //TODO: why sending req to base64all?
                base64all(req, res, next);
            });
    };

    return this;
}


module.exports = new propertyDbHelper();