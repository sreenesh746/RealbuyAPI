function propertyController() {
    var dbHelper = require('../helpers/propertydbhelper');
    const passport = require('passport');
    const config = require('../settings/config');
    var passportConfigure=require('../settings/passport');
    const jwt = require('jsonwebtoken');
    // Creating New Property
    this.createProperty = function(req, res) {
        //TODO: why didnt you move this function to helper, you moved every other functions, moved
        dbHelper.addProperty(req,res);
    };

    this.search = function(req, res) {
        log.info(req.params);
        dbHelper.search(req,res);
    };

    this.getFeaturedProperties=function(req,res) {
         dbHelper.featuredProperties(req,res);
    };
    // Fetching Details of Properties
    this.getProperties = function(req, res, next) {
            passportConfigure(passport);
            passport.authenticate('jwt', {
                session: false
            }, function(error, user, info, status) {
                if (user) {
                    req.user = user;
                }
                dbHelper.getProperties(req,res);
            })(req, res, next);
    };

    return this;
};

module.exports = new propertyController();