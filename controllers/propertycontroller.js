var dbHelper = require('../helpers/propertydbhelper');
var passportConfigure=require('../settings/passport');
const passport = require('passport');
const config = require('../settings/config');
const jwt = require('jsonwebtoken');

function propertyController() {

    this.createProperty = function(req, res) {
        dbHelper.addProperty(req,res);
    };
    this.search = function(req, res) {
        log.info(req.params);
        dbHelper.search(req,res);
    };
    this.getFeaturedProperties=function(req,res) {
        dbHelper.featuredProperties(req,res);
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
            dbHelper.getProperties(req,res);
        })(req, res, next);
    };

    return this;
};

module.exports = new propertyController();