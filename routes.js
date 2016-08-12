const passport = require('passport');
const config = require('./settings/config');
const jwt = require('jsonwebtoken');
const requireAuth = passport.authenticate('jwt', {
    session: false
});
module.exports = function(app) {
    app.use(passport.initialize());
    require('./settings/passport')(passport);
    var user = require('./controllers/usercontroller');
    var property = require('./controllers/propertycontroller');
    var contact = require('./controllers/contactcontroller');
    app.post('/realbuyapi/addProperty', requireAuth, property.createProperty);
    app.post('/realbuyapi/signup', user.createUser); 
    app.post('/realbuyapi/contact', contact.createContact); 
    app.get('/realbuyapi/contact', contact.getContactUs); 
    app.get('/realbuyapi/search', property.search);
    app.put('/realbuyapi/favourite', requireAuth, user.updateFavourite);
    app.post('/realbuyapi/login', user.login);
    app.get('/realbuyapi', property.getProperties);
    app.get('/realbuyapi/featured',property.getFeaturedProperties);
};