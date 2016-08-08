function userController() {
    var dbHelper = require('../helpers/userdbhelper');

    // Creating New User
    this.createUser = function(req, res, next) {
        console.log(req.files);
        console.log(req.params);
        var profile = req.params;
        var currentDateTime=Date.now();
        profile['photo'] = './uploads/profile/' + currentDateTime + req.files.avatar.name;
        req.profile = profile;
        dbHelper.addUser(req,res,next);
    };

    this.login = function(req, res, next) {
        dbHelper.authenticateUser(req,res,next);
    };


    this.profile = function(req, res, next) {
        res.json(req.user);
    }

    this.updateFavourite = function(req, res, next) {
        if (req.params.flag == 'true') {
            dbHelper.addFavourite(req,res,next);
        } else if (req.params.flag == 'false') {
            dbHelper.removeFavourite(req,res,next);
        }       
    };
  
    return this;
};

module.exports = new userController();