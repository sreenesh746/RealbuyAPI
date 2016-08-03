const passport = require('passport');
const config = require('./config');
const jwt = require('jsonwebtoken');
const requireAuth = passport.authenticate('jwt', { session: false });
module.exports = function(app) {
	// Initialize passport for use
	app.use(passport.initialize());
	// Bring in defined Passport Strategy
	require('./passport')(passport);
	var user = require('./controllers/usercontroller');
	var property = require('./controllers/propertycontroller');	
	var contact = require('./controllers/contactcontroller');
	app.get('/', function(req, res, next) {
		return res.send("WELCOME TO REST API");
	});
 	app.post('/realbuyapi/addProperty',requireAuth, function(req,res,next){ //Create Property API
	property.createProperty(req,res,next);
	});
	app.post('/realbuyapi/signup', user.createUser); //Create User API
    app.get('/realbuyapi/getUsers', user.getUsers);  // Get All Users Details API
	app.post('/realbuyapi/contact', contact.createContact); //Create Contact Us API
    app.get('/realbuyapi/contact', contact.getContactUs);  // Get All Contact Us Message Details API
    app.get('/realbuyapi/search',property.search);
    app.put('/realbuyapi/favourite',requireAuth, function(req,res,next){
    user.updateFavourite(req,res,next);
    }); // favourite/unfavourite a property API
	app.post('/realbuyapi/login', user.login); //Create Property API
    app.get('/realbuyapi/profile',requireAuth, function(req,res,next){
 	user.profile(req,res,next);
    });
    app.get('/realbuyapi',function(req,res,next){
    		property.getProperties(req,res,next);
    });
    app.get('/realbuyapi/authorized',requireAuth, function(req,res,next){
    	property.getPropertiesAuthorized(req,res,next);
    });
};
