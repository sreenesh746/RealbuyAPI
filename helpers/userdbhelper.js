const config = require('../settings/config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var log = require('../logger');
var fs = require('fs');
var user = require('../models/user');
var authUser = require('../models/user');
var property = require('../models/property');
var responseData;
var error;

function userDbHelper() {
    this.addUser = function(req, cb) {
        var newUser = new user(req.profile);
        newUser.save(function(err, result) {
            if (err) {
                error = {
                    status: 400,
                    message: 'Email Already Exists'
                };
                log.error(err.message);
                return cb(error);
            } else {
                fs.rename(req.files.avatar.path, req.profile['photo'], function(err) {
                    if (err) {
                        error = {
                            status: 500,
                            message: 'File Upload Failed'
                        };
                        log.error(err.message);
                        return cb(error);
                    }
                });
                log.info('User Added');
                responseData = {
                    success: true,
                    message: 'Sign Up Success',
                    data: null
                };
                return cb(null, responseData);
            }
        });
    };
    this.authenticateUser = function(req, cb) {
        user.findOne({
                email: req.params.email
            },
            function(err, authUser) {
                if (err) {
                    error = {
                        status: 400,
                        message: 'Bad Request'
                    };
                    log.error(err.message);
                    return cb(error);
                } else if (!authUser) {
                    log.info('Authentication failed. User not found.');
                    error = {
                        status: 401,
                        message: 'Authentication failed. User not found.'
                    };
                    return cb(error);
                } else {
                    authUser.comparePassword(req.params.password, function(err, isMatch) {
                        if (isMatch) {
                            const token = jwt.sign({
                                id: authUser._id
                            }, config.secret, {
                                expiresIn: 180 // in seconds
                            });
                            log.info('Authenticated User');
                            responseData = {
                                success: true,
                                token: 'JWT ' + token
                            };
                            return cb(null, responseData);
                        } else {
                            error = {
                                status: 401,
                                message: 'Authentication failed. Incorrect password.'
                            };
                            return cb(error);
                        }
                    });
                }
            });
    };
    this.updateFavourite = function(req, cb) {
        var addOrRemove = 0;
        if (req.params.flag == 'true') {
            addOrRemove = 1;
            user.findOneAndUpdate({
                    _id: req.user._id
                }, {
                    $push: {
                        favourites: req.params.pid
                    }
                }, {},
                function(err, result) {
                    if (err) {
                        log.info('Property not found');
                        error = {
                            status: 404,
                            message: 'Property not found'
                        };
                        return cb(error);
                    } else {
                        log.info('favourite added');
                    }
                });
        } else if (req.params.flag == 'false') {
            addOrRemove = -1;
            user.update({
                    _id: req.user._id
                }, {
                    $pull: {
                        favourites: req.params.pid
                    }
                }, {},
                function(err, result) {
                    if (err) {
                        log.info('Property not found');
                        error = {
                            status: 404,
                            message: 'Property not found'
                        };
                        return cb(error);
                    } else {
                        log.info('favourite removed');
                    }
                });
        } else {
            error = {
                status: 400,
                message: 'Invalid flag value or property ID'
            };
            return cb(error);
        }
        property.findOneAndUpdate({
                _id: req.params.pid
            }, {
                $inc: {
                    favCount: addOrRemove
                }
            }, {},
            function(err, result) {
                if (err) {
                    log.error(err);
                    error = {
                        status: 500,
                        message: err.message
                    }
                    return cb(error);
                } else {
                    log.info('favourite count updated');
                    responseData = {
                        success: true,
                        message: 'property favourite updated',
                        data: null
                    };
                    return cb(null, responseData);
                }
            }
        );
    };
    return this;
}
module.exports = new userDbHelper();