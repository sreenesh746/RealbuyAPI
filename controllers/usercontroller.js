function userController() {
    var log = require('../logger');
    var dbHelper = require('../helpers/userdbhelper');

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
    this.updateFavourite = function(req, res) {
       dbHelper.updateFavourite(req,res);
    };

    return this;
};

module.exports = new userController();