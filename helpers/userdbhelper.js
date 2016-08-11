function userDbHelper() {
    var log = require('../logger');
    var fs = require('fs');
    var user = require('../models/user');
    var property = require('../models/property')
    const config = require('../settings/config');
    const passport = require('passport');
    const jwt = require('jsonwebtoken');

    this.addUser = function(req, res, next) {
        var newUser = new user(req.profile);
        newUser.save(function(err, result) {
            if (err) {
                log.error('Email Already Exists');
                return res.json(400,{
                    'error': 'Email Already Exists'
                });
            } else {
                fs.rename(req.files.avatar.path, req.profile['photo'], function(err) {
                    if (err)
                        return  log.error(err);
                });
                log.info('User Added');
                return res.json({
                    'status': 'successfully saved'
                });
            }
        });
    };

    this.authenticateUser = function(req, res, next) {
        user.findOne({
                email: req.params.email
            },
            function(err, authUser) {
                //TODO: use diff name here, confused with 'user', fixed
                if (err)
                {
                    log.error(err);
                    res.json(400,{message:'Bad Request'});
                }

                    //TODO: why no response, fixed
                else if (!authUser) {
                    log.info('Authentication failed. User not found.');
                    res.json(401, {
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });
                } else {
                        // Check if password matches
                        authUser.comparePassword(req.params.password, function(err, isMatch) {
                        if (isMatch) {
                            //TODO: why checking for err and isMatch at the same time, fixed
                            // Create token if the password matched and no error was thrown
                            const token = jwt.sign({
                                id: authUser._id
                            }, config.secret, {
                                expiresIn: 180 // in seconds
                            });
                            log.info('Authenticated User');
                            res.json(200, {
                                success: true,
                                token: 'JWT ' + token
                            });
                        } else {
                            log.info('Authentication failed. Passwords did not match.');
                            res.json(401, {
                                success: false,
                                message: 'Authentication failed. Passwords did not match.'
                            });
                        }
                    });
                }
            });
    };

    //TODO: you can combine addFavourite and removeFavourite
    this.addFavourite = function(req, res, next) {
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
                    return res.json(404,{
                        'error': 'Property not found'
                    });
                } else {
                    log.info('favourite added');
                    res.json({
                        'status': 'success'
                    });
                }
            });
        property.findOneAndUpdate({
                _id: req.params.pid
            }, {
                $inc: {
                    favCount: 1
                }
            }, {},
            function(err, result) {
                if (err) {
                    log.error(err);
                    return res.send(err);
                } else {
                    log.info('favourite count incremented');
                    return res.json({
                        'status': 'success'
                    });
                }
            });
    };

    this.removeFavourite = function(req, res, next) {
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
                    return res.json(404,{
                        'error': 'Property not found'
                    });
                } else {
                    log.info('favourite removed');
                    res.json({
                        'status': 'success'
                    });
                }
            });
        property.findOneAndUpdate({
                _id: req.params.pid
            }, {
                $inc: {
                    favCount: -1
                }
            }, {},
            function(err, result) {
                if (err) {
                    log.error(err);
                    return res.json({
                        'error': err
                    });
                } else {
                     log.info('favourite count decremented');
                    return res.json({
                        'status': 'success'
                    });
                }
            });

    };

    return this;
}


module.exports = new userDbHelper();