function propertyController() {
    var dbHelper = require('../helpers/propertydbhelper');
    const passport = require('passport');
    const config = require('../settings/config');
    var passportConfigure=require('../settings/passport');
    const jwt = require('jsonwebtoken');
    // Creating New Property
    this.createProperty = function(req, res, next) {
        //TODO: why didnt you move this function to helper, you moved every other functions
        var propertyDetails = req.params;
        propertyDetails.owner = req.user._id;
        location = [propertyDetails['lng'], propertyDetails['lat']];
        delete propertyDetails['lng'];
        delete propertyDetails['lat'];
        propertyDetails['location'] = location;
        var currentDateTime=Date.now();
        propertyDetails['photo'] = './uploads/properties/' + currentDateTime + req.files.photo.name;
        log.info(propertyDetails);
        req.propertyDetails = propertyDetails;
        dbHelper.addProperty(req,res,next);
    };

    this.search = function(req, res, next) {
        log.info(req.params);
        dbHelper.search(req,res,next);
    };

    this.getFeaturedProperties=function(req,res,next) {
         dbHelper.featuredProperties(req,res,next);
    };
    // Fetching Details of Properties
    this.getProperties = function(req, res, next) {
            passportConfigure(passport);
            passport.authenticate('jwt', {
                session: false
            }, function(error, user, info, status) {
                if (user) {
                    req.user = user;
                    dbHelper.getPropertiesAuthorized(req,res,next);
                }
                dbHelper.getProperties(req,res,next);
            })(req, res, next);
    };

    return this;
};

module.exports = new propertyController();