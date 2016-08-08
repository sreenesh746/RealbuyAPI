function propertyController() {
    var dbHelper = require('../helpers/propertydbhelper')
    // Creating New Property
    this.createProperty = function(req, res, next) {
        var propertyDetails = req.params;
        propertyDetails.owner = req.user._id;
        location = [propertyDetails['lng'], propertyDetails['lat']];
        delete propertyDetails['lng'];
        delete propertyDetails['lat'];
        propertyDetails['location'] = location;
        console.log(req.files);
        var currentDateTime=Date.now();
        propertyDetails['photo'] = './uploads/properties/' + currentDateTime + req.files.photo.name;
        req.propertyDetails = propertyDetails;
        dbHelper.addProperty(req,res,next);
    };

    this.search = function(req, res, next) {
        console.log(req.params);
        dbHelper.search(req,res,next);
    };

    this.getFeaturedProperties=function(req,res,next) {
         dbHelper.featuredProperties(req,res,next);
    };
    // Fetching Details of Properties
    this.getProperties = function(req, res, next) {
        dbHelper.getProperties(req,res,next);
    };

    this.getPropertiesAuthorized = function(req, res, next) {
       dbHelper.getPropertiesAuthorized(req,res,next);
    };
    return this;
};

module.exports = new propertyController();