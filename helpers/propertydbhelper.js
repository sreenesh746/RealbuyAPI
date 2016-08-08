function propertyDbHelper() {
    var fs = require('fs');
    var async = require('async');
    var base64 = require('./base64');
    var base64all = require('./base64all');
    var property = require('../models/property');
    var user = require('../models/user');

    this.addProperty = function(req, res, next) {
        var newProperty = new property(req.propertyDetails);
        newProperty.save(function(err, result) {
            if (err) {
                console.log(err);
                return res.json({
                    'error': err
                });
            } else {
                fs.rename(req.files.photo.path, req.propertyDetails['photo'], function(err) {
                    if (err)
                        console.log(err);
                });
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
                            console.log(err);
                            return res.json({
                                'error': err
                            });
                        } else {
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
                    console.log(err);
                    return res.json({
                        'error': err
                    });
                } else {
                    req.result = result;
                    base64(req, res, next);
                }
            });
    };

    this.featuredProperties=function(req, res, next) {
        property.find({}).skip(req.params.page * 6).limit(6).sort({
            favCount: -1
        }).exec(function(err, result) {
            if (err)
                return res.json({
                    'error': err
                });
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
                //console.log(results);
                req.results = results;
                base64all(req, res, next);

            });
    };

    this.getPropertiesAuthorized=function(req, res, next) {
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
                req.results = results;
                base64all(req, res, next);
            });
    };

    return this;
}


module.exports = new propertyDbHelper();