const passport = require('passport');
const config = require('./settings/config');
const jwt = require('jsonwebtoken');
const requireAuth = passport.authenticate('jwt', {
    session: false
});
module.exports = function(app) {
    //TODO: remove silly comments inside functions, comment only the logics that is if they are complex.
    app.use(passport.initialize());
    require('./settings/passport')(passport);
    var user = require('./controllers/usercontroller');
    var property = require('./controllers/propertycontroller');
    var contact = require('./controllers/contactcontroller');
    app.get('/', function(req, res, next) {
        return res.send("WELCOME TO REST API");
    });
    app.post('/realbuyapi/addProperty', requireAuth, function(req, res, next) {
        property.createProperty(req, res, next);
    });
    app.post('/realbuyapi/signup', user.createUser); 
    app.post('/realbuyapi/contact', contact.createContact); 
    app.get('/realbuyapi/contact', contact.getContactUs); 
    app.get('/realbuyapi/search', property.search);
    app.put('/realbuyapi/favourite', requireAuth, function(req, res, next) { 
        user.updateFavourite(req, res, next);
    });
    app.post('/realbuyapi/login', user.login); 
    app.get('/realbuyapi/profile', requireAuth, function(req, res, next) {
        user.profile(req, res, next);
    });
    app.get('/realbuyapi', property.getProperties);
    app.get('/realbuyapi/featured',property.getFeaturedProperties);
};