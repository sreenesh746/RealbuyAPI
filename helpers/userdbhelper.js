const config = require('../settings/config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var log = require('../logger');
var fs = require('fs');
var user = require('../models/user');
var authUser = require('../models/user');
var property = require('../models/property');


function userDbHelper() {

    this.addUser = function(req, res,cb) {
        var newUser = new user(req.profile);
        newUser.save(function(err, result) {
            if (err) {
                var details = {
                    status:400,
                    success:false, 
                    message: 'Email Already Exists',
                    data:null
                };
                return cb(err,details);
            } else {
                fs.rename(req.files.avatar.path, req.profile['photo'], function(err) {
                    if (err){
                        details = {
                            status:500,
                            success:false, 
                            message: 'File Upload Failed',
                            data:null
                        };
                        return cb(err,details);
                    }
                });
                log.info('User Added');
                details = {
                    status:200,
                    success:true, 
                    message: 'Sign Up Success',
                    data:null
                };
                cb(false,details);
            }
        });
    };

    this.authenticateUser = function(req, res) {
        user.findOne({
                email: req.params.email
            },
            function(err, authUser) {
                if (err)
                {
                    log.error(err);
                    res.json(400,{message:'Bad Request'});
                }
                else if (!authUser) {
                    log.info('Authentication failed. User not found.');
                    res.json(401, {
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });
                } else {
                        authUser.comparePassword(req.params.password, function(err, isMatch) {
                        if (isMatch) {
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

    this.updateFavourite = function(req, res) {
        var addOrRemove=0;
        if(req.params.flag=='true'){
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
                    return res.json(404,{
                        'error': 'Property not found'
                    });
                } else {
                    log.info('favourite added');
                    res.json({
                        status: 'success'
                    });
                }
            });
        }
        else if(req.params.flag=='false'){
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
                    return res.json(404,{
                        error: 'Property not found'
                    });
                } else {
                    log.info('favourite removed');
                    res.json({
                        status: 'success'
                    });
                }
            });
        }
        else {
            return res.json(400,{message:'Invalid flag value'});
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
                    return res.send(err);
                } else {
                    log.info('favourite count updated');
                    return res.json({
                        status: 'success'
                    });
                }
            });
    };

    return this;
}


module.exports = new userDbHelper();