const passport = require('passport');
const config = require('./settings/config');
const jwt = require('jsonwebtoken');
const requireAuth = passport.authenticate('jwt', {
    session: false
});
module.exports = function(app) {
    //TODO: remove silly comments inside functions, comment only the logics that is if they are complex.
    // Initialize passport for use
    app.use(passport.initialize());
    // Bring in defined Passport Strategy
    require('./settings/passport')(passport);
    var user = require('./controllers/usercontroller');
    var property = require('./controllers/propertycontroller');
    var contact = require('./controllers/contactcontroller');
    app.get('/', function(req, res, next) {
        return res.send("WELCOME TO REST API");
    });
    app.post('/realbuyapi/addProperty', requireAuth, function(req, res, next) { //Create Property API
        property.createProperty(req, res, next);
    });
    app.post('/realbuyapi/signup', user.createUser); //Create User API
    app.post('/realbuyapi/contact', contact.createContact); //Create Contact Us API
    app.get('/realbuyapi/contact', contact.getContactUs); // Get All Contact Us Message Details API
    app.get('/realbuyapi/search', property.search);
    app.put('/realbuyapi/favourite', requireAuth, function(req, res, next) { // favourite/unfavourite a property API
        user.updateFavourite(req, res, next);
    });
    app.post('/realbuyapi/login', user.login); //Create Property API
    app.get('/realbuyapi/profile', requireAuth, function(req, res, next) {
        user.profile(req, res, next);
    });
    app.get('/realbuyapi',
        //TODO: move this to controller
        function(req, res, next) {
            passport.authenticate('jwt', {
                session: false
            }, function(error, user, info, status) {
                if (user) {
                    req.user = user;
                    property.getPropertiesAuthorized(req, res, next);
                }
                property.getProperties(req, res, next);
            })(req, res, next);
        }
    );
    app.get('/realbuyapi/featured',property.getFeaturedProperties);
};