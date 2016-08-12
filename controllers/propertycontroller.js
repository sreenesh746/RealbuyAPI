var dbHelper = require('../helpers/propertydbhelper');
var passportConfigure = require('../settings/passport');
const passport = require('passport');
const config = require('../settings/config');
const jwt = require('jsonwebtoken');

function propertyController() {
    this.createProperty = function(req, res) {
        dbHelper.addProperty(req, function(err, result) {
            if (err) {
                res.json(err.status, {
                    message: err.message
                });
            } else {
                res.json(200, result);
            }
        });
    };
    this.search = function(req, res) {
        log.info(req.params);
        dbHelper.search(req, function(err, result) {
            if (err) {
                res.json(err.status, {
                    message: err.message
                });
            } else {
                res.json(200, result);
            }
        });
    };
    this.getFeaturedProperties = function(req, res) {
        dbHelper.featuredProperties(req, function(err, result) {
            if (err) {
                res.json(err.status, {
                    message: err.message
                });
            } else {
                res.json(200, result);
            }
        });
    };
    this.getProperties = function(req, res, next) {
        passportConfigure(passport);
        passport.authenticate('jwt', {
                session: false
            },
            function(error, user, info, status) {
                if (user) {
                    req.user = user;
                }
                dbHelper.getProperties(req, function(err, result) {
                    if (err) {
                        res.json(err.status, {
                            message: err.message
                        });
                    } else {
                        res.json(200, result);
                    }
                });
            })(req, res, next);
    };
    return this;
};
module.exports = new propertyController();