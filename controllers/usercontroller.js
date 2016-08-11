function userController() {
    var log = require('../logger');
    var dbHelper = require('../helpers/userdbhelper');

    // Creating New User
    this.createUser = function(req, res) {
        var profile = req.params;
        log.info(profile);
        var currentDateTime=Date.now();
        profile['photo'] = './uploads/profile/' + currentDateTime + req.files.avatar.name;
        req.profile = profile;
        dbHelper.addUser(req,res);
    };

    this.login = function(req, res) {
        dbHelper.authenticateUser(req,res);
    };


    this.profile = function(req, res) {
        log.info(req.user);
        res.json(req.user);
        //TODO: why sending a response from the request itself
        // req.user contains the details of user authorized through Passport JWT
    }

    this.updateFavourite = function(req, res) {
       dbHelper.updateFavourite(req,res);
    };
  
    return this;
};

module.exports = new userController();