var fs = require('fs');
var log = require('../logger');
var async = require('async');
var base64 = require('./base64');
var base64all = require('./base64all');
var property = require('../models/property');
var user = require('../models/user');
var responseData;
var error;

function propertyDbHelper() {
    this.addProperty = function(req, cb) {
        var propertyDetails = req.params;
        console.log(req.params);
        console.log(req.files.photo);
        var filename = req.files.photo.name;
        propertyDetails.owner = req.user._id;
        location = [propertyDetails['lng'], propertyDetails['lat']];
        delete propertyDetails['lng'];
        delete propertyDetails['lat'];
        propertyDetails['location'] = location;
        var currentDateTime = Date.now();
        propertyDetails['photo'] = './uploads/properties/' + currentDateTime + filename;
        log.info(propertyDetails);
        var newProperty = new property(propertyDetails);
        newProperty.save(function(err, result) {
            if (err) {
                error = {
                    status: 400,
                    message: 'Could not add property. Please ensure all mandatory fields are filled'
                };
                log.error(err.message);
                return cb(error);
            } else {
                fs.rename(req.files.photo.path, propertyDetails['photo'], function(err) {
                    if (err) {
                        error = {
                            status: 500,
                            message: 'Photo upload failed'
                        };
                        log.error(err.message);
                        return cb(error);
                    }
                });
                log.info('property added');
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
                            error = {
                                status: 401,
                                message: 'Un Authorized User Attempt to add property. Please login to add property.'
                            };
                            return cb(error);
                        } else {
                            log.info('property added to owner');
                            responseData = {
                                success: true,
                                message: 'Property Added',
                                data: null
                            };
                            return cb(null, responseData);
                        }
                    });
            }
        });
    };
    this.search = function(req, cb) {
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
                    log.error(err.message);
                    error = {
                        status: 400,
                        message: 'Bad Request. Check Request parameters'
                    };
                    return cb(error);
                } else {
                    log.info('Search successful');
                    base64.toBase64(result, function(err, result) {
                        if (err) {
                            log.error(err.message);
                            error = {
                                status: 500,
                                message: 'Error in processing images'
                            };
                            return cb(error);
                        }
                        log.info('Images processed successfully');
                        responseData = {
                            success: true,
                            message: 'Search result',
                            data: result
                        };
                        return cb(null, responseData);
                    });
                }
            });
    };
    this.featuredProperties = function(req, cb) {
        property.find({}).skip(req.params.page * 6).limit(6).sort({
            favCount: -1
        }).exec(function(err, result) {
            if (err) {
                log.error(err.message);
                error = {
                    status: 400,
                    message: 'Bad Request. Check Request parameters'
                };
                return cb(error);
            }
            log.info('featured properties fetched from database');
            base64.toBase64(result, function(err, result) {
                if (err) {
                    log.error(err.message);
                    error = {
                        status: 500,
                        message: 'Error in processing images'
                    };
                    return cb(error);
                }
                log.info('Images processed successfully');
                responseData = {
                    success: true,
                    message: 'result',
                    data: result
                };
                return cb(null, responseData);
            });
        });
    };
    this.getProperties = function(req, cb) {
        async.parallel([
                function(callback) {
                    property.find({}).limit(6).sort({
                        favCount: -1
                    }).exec(callback);
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
                if (err) {
                    log.error(err.message);
                    error = {
                        status: 500,
                        message: err.message
                    };
                    return cb(error);
                }
                log.info('Properties fetched from database');
                if (req.user) {
                    favourites = req.user.favourites;
                } else {
                    favourites = undefined;
                }
                base64all.toBase64(results, favourites, function(err, result) {
                    if (err) {
                        log.error(err.message);
                        error = {
                            status: 500,
                            message: 'Error in processing images'
                        };
                        return cb(error);
                    } else {
                        log.info('Images processed successfully');
                        responseData = {
                            success: true,
                            message: 'result',
                            data: result
                        };
                        return cb(null, responseData);
                    }
                });
            });
    };
    return this;
}
module.exports = new propertyDbHelper();