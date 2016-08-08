function userDbHelper() {
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
                console.log(err);
                return res.json({
                    'error': err
                });
            } else {
                fs.rename(req.files.avatar.path, req.profile['photo'], function(err) {
                    if (err)
                        return console.error(err);
                });
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
            function(err, user) {
                if (err) throw err;
                if (!user) {
                    res.json(401, {
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });
                } else {
                    // Check if password matches
                    console.log(JSON.stringify(user));
                    user.comparePassword(req.params.password, function(err, isMatch) {
                        if (isMatch && !err) {
                            // Create token if the password matched and no error was thrown
                            delete user['password'];
                            const token = jwt.sign(JSON.stringify({
                                id: user._id
                            }), config.secret, {
                                expiresIn: 180 // in seconds
                            });
                            res.json(200, {
                                success: true,
                                token: 'JWT ' + token
                            });
                        } else {
                            res.json(401, {
                                success: false,
                                message: 'Authentication failed. Passwords did not match.'
                            });
                        }
                    });
                }
            });
    };

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
                    console.log(err);
                    return res.json({
                        'error': err
                    });
                } else {
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
                    console.log(err);
                    return res.send(err);
                } else {
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
                    console.log(err);
                    return res.json({
                        'error': err
                    });
                } else {
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
                    console.log(err);
                    return res.json({
                        'error': err
                    });
                } else {
                    return res.json({
                        'status': 'success'
                    });
                }
            });

    };

    return this;
}


module.exports = new userDbHelper();