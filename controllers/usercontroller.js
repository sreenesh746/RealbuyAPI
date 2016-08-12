var log = require('../logger');
var dbHelper = require('../helpers/userdbhelper');

function userController() {
    this.createUser = function(req, res) {
        var profile = req.params;
        log.info(profile);
        var currentDateTime = Date.now();
        profile['photo'] = './uploads/profile/' + currentDateTime + req.files.avatar.name;
        req.profile = profile;
        dbHelper.addUser(req, function(err, result) {
            if (err) {
                res.json(err.status, {
                    message: err.message
                });
            } else {
                res.json(200, result);
            }

        });
    };
    this.login = function(req, res) {
        dbHelper.authenticateUser(req, function(err, result) {
            if (err) {
                res.json(err.status, {
                    message: err.message
                });
            } else {
                res.json(200, result);
            }
        });
    };
    this.updateFavourite = function(req, res) {
        dbHelper.updateFavourite(req, function(err, result) {
            if (err) {
                res.json(err.status, {
                    message: err.message
                });
            } else {
                res.json(200, result);
            }
        });
    };
    return this;
};
module.exports = new userController();