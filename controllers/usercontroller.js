function userController() {
    var user = require('../models/user');
    var property = require('../models/property');
    const config = require('../config');
    const passport = require('passport');
    const jwt = require('jsonwebtoken');
    var fs = require('fs');

    // Creating New User
    this.createUser = function(req, res, next) {
        console.log(req.files);
        console.log(req.params);
        var profile = req.params;
        profile['photo'] = 'http://localhost:9001/uploads/profile/' + Date.now() + req.files.avatar.name;
        var newUser = new user(profile);
        newUser.save(function(err, result) {
            if (err) {
                console.log(err);
                return res.json({
                    'error': err
                });
            } else {
                fs.rename(req.files.avatar.path, './uploads/profile/' + Date.now() + req.files.avatar.name, function(err) {
                    if (err)
                        return console.error(err);
                });
                return res.json({
                    'status': 'successfully saved'
                });
            }
        });
    };

    this.login = function(req, res, next) {
        console.log(req.params.email);
        console.log(req.params.password);
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
                            const token = jwt.sign(JSON.stringify({id : user._id}), config.secret, {
                                expiresIn: 10080 // in seconds
                            });
                            console.log('user' + JSON.stringify(user));
                            console.log(config.secret);
                            console.log(token);
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


    this.profile = function(req, res, next) {
        console.log(JSON.stringify(req.user));
        res.json(req.user);
    }

    this.updateFavourite = function(req, res, next) {
        if (req.params.flag == 'true') {
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
        } else if (req.params.flag == 'false') {
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
        }
    };
    // Fetching Details of Users
    this.getUsers = function(req, res, next) {
        user.find({}, function(err, result) {
            if (err) {
                console.log(err);
                return res.json({
                    'error': err
                });
            } else {
                console.log(result);
                return res.json({
                    'users Details': result
                });
            }
        });
    };
    return this;
};

module.exports = new userController();